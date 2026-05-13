require('dotenv').config();

const {
    Client,
    GatewayIntentBits,
    Partials,
    EmbedBuilder
} = require('discord.js');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./mcdreamy.db');

/*
=====================================
SAFETY NET (CRASH PREVENTION)
=====================================
*/

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

/*
=====================================
CONFIG
=====================================
*/

const EMOJI = '💉';
const LEADERBOARD_CHANNEL_ID = process.env.LEADERBOARD_CHANNEL_ID;

/*
=====================================
VALIDATION (CRITICAL)
=====================================
*/

if (!process.env.TOKEN) {
    console.error("Missing TOKEN in environment variables");
    process.exit(1);
}

if (!LEADERBOARD_CHANNEL_ID) {
    console.error("Missing LEADERBOARD_CHANNEL_ID in environment variables");
    process.exit(1);
}

/*
=====================================
DISCORD CLIENT
=====================================
*/

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction
    ]
});

/*
=====================================
DATABASE
=====================================
*/

db.run(`
CREATE TABLE IF NOT EXISTS leaderboard (
    user_id TEXT PRIMARY KEY,
    username TEXT,
    points INTEGER DEFAULT 0
)
`);

db.run(`
CREATE TABLE IF NOT EXISTS claims (
    message_id TEXT PRIMARY KEY,
    claimed_by TEXT
)
`);

db.run(`
CREATE TABLE IF NOT EXISTS config (
    key TEXT PRIMARY KEY,
    value TEXT
)
`);

/*
=====================================
READY EVENT
=====================================
*/

client.once('ready', async () => {
    console.log(`💉 McDreamy online as ${client.user.tag}`);

    try {
        await ensureLeaderboardMessage();
        await updateLeaderboard();
    } catch (err) {
        console.error("Startup error:", err);
    }
});

/*
=====================================
ENSURE LEADERBOARD MESSAGE
=====================================
*/

async function ensureLeaderboardMessage() {
    let channel;

    try {
        channel = await client.channels.fetch(LEADERBOARD_CHANNEL_ID);
    } catch (err) {
        console.error("Failed to fetch channel:", err);
        return;
    }

    if (!channel) return;

    db.get(`
        SELECT value FROM config WHERE key = 'leaderboard_message'
    `, async (err, row) => {

        if (err) {
            console.error("DB error:", err);
            return;
        }

        if (row) return;

        const embed = new EmbedBuilder()
            .setTitle('💉 McDreamy Leaderboard')
            .setDescription('No activity yet.')
            .setFooter({ text: 'Live engagement tracking system' });

        try {
            const msg = await channel.send({ embeds: [embed] });

            db.run(`
                INSERT INTO config(key, value)
                VALUES ('leaderboard_message', ?)
            `, [msg.id]);

        } catch (err) {
            console.error("Failed to send leaderboard message:", err);
        }
    });
}

/*
=====================================
UPDATE LEADERBOARD
=====================================
*/

async function updateLeaderboard() {

    db.get(`
        SELECT value FROM config WHERE key = 'leaderboard_message'
    `, async (err, row) => {

        if (err) {
            console.error("DB error:", err);
            return;
        }

        if (!row) return;

        let channel;

        try {
            channel = await client.channels.fetch(LEADERBOARD_CHANNEL_ID);
        } catch (err) {
            console.error("Channel fetch failed:", err);
            return;
        }

        if (!channel) return;

        let message;

        try {
            message = await channel.messages.fetch(row.value);
        } catch (err) {
            console.error("Message fetch failed:", err);
            return;
        }

        db.all(`
            SELECT username, points
            FROM leaderboard
            ORDER BY points DESC
            LIMIT 10
        `, async (err, rows) => {

            if (err) {
                console.error("DB error:", err);
                return;
            }

            let text = '';

            if (!rows || rows.length === 0) {
                text = 'No activity yet.';
            } else {
                rows.forEach((r, i) => {

                    const medal =
                        i === 0 ? '🥇' :
                        i === 1 ? '🥈' :
                        i === 2 ? '🥉' :
                        `${i + 1}.`;

                    text += `${medal} ${r.username} — ${r.points} 💉\n`;
                });
            }

            const embed = new EmbedBuilder()
                .setTitle('💉 McDreamy Engagement Leaderboard')
                .setDescription(text)
                .setFooter({
                    text: `Updated ${new Date().toLocaleString()}`
                });

            try {
                await message.edit({ embeds: [embed] });
            } catch (err) {
                console.error("Failed to edit leaderboard:", err);
            }
        });
    });
}

/*
=====================================
REACTION TRACKING
=====================================
*/

client.on('messageReactionAdd', async (reaction, user) => {

    try {
        if (user.bot) return;

        if (reaction.partial) await reaction.fetch();

        if (reaction.emoji.name !== EMOJI) return;

        db.get(`
            SELECT * FROM claims WHERE message_id = ?
        `, [reaction.message.id], async (err, row) => {

            if (err) {
                console.error("DB error:", err);
                return;
            }

            if (row) {
                await reaction.users.remove(user.id).catch(() => {});
                return;
            }

            db.run(`
                INSERT INTO claims(message_id, claimed_by)
                VALUES (?, ?)
            `, [reaction.message.id, user.id]);

            db.run(`
                INSERT INTO leaderboard(user_id, username, points)
                VALUES (?, ?, 1)
                ON CONFLICT(user_id)
                DO UPDATE SET
                    points = points + 1,
                    username = excluded.username
            `, [user.id, user.username]);

            await updateLeaderboard();
        });

    } catch (err) {
        console.error("Reaction handler error:", err);
    }
});

/*
=====================================
LOGIN
=====================================
*/

client.login(process.env.TOKEN);