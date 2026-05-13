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
CONFIG
=====================================
*/

const EMOJI = '💉';

const LEADERBOARD_CHANNEL_ID = 'CHANNEL_ID';

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
READY
=====================================
*/

client.once('ready', async () => {
    console.log(`💉 McDreamy online as ${client.user.tag}`);

    await ensureLeaderboardMessage();
    await updateLeaderboard();
});

/*
=====================================
ENSURE LEADERBOARD MESSAGE
=====================================
*/

async function ensureLeaderboardMessage() {

    const channel = await client.channels.fetch(LEADERBOARD_CHANNEL_ID);

    db.get(`
        SELECT value FROM config WHERE key = 'leaderboard_message'
    `, async (err, row) => {

        if (row) return;

        const embed = new EmbedBuilder()
            .setTitle('💉 McDreamy Leaderboard')
            .setDescription('No activity yet.')
            .setFooter({ text: 'Live engagement tracking system' });

        const msg = await channel.send({ embeds: [embed] });

        db.run(`
            INSERT INTO config(key, value)
            VALUES ('leaderboard_message', ?)
        `, [msg.id]);
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

        if (!row) return;

        const channel = await client.channels.fetch(LEADERBOARD_CHANNEL_ID);
        const message = await channel.messages.fetch(row.value);

        db.all(`
            SELECT username, points
            FROM leaderboard
            ORDER BY points DESC
            LIMIT 10
        `, async (err, rows) => {

            let text = '';

            if (!rows.length) {
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

            await message.edit({ embeds: [embed] });
        });
    });
}

/*
=====================================
REACTION TRACKING (GLOBAL)
=====================================
*/

client.on('messageReactionAdd', async (reaction, user) => {

    if (user.bot) return;

    if (reaction.partial) await reaction.fetch();

    // ONLY TRACK 💉
    if (reaction.emoji.name !== EMOJI) return;

    // PREVENT DOUBLE COUNTING PER MESSAGE
    db.get(`
        SELECT * FROM claims WHERE message_id = ?
    `, [reaction.message.id], async (err, row) => {

        if (row) {
            await reaction.users.remove(user.id);
            return;
        }

        // MARK CLAIMED
        db.run(`
            INSERT INTO claims(message_id, claimed_by)
            VALUES (?, ?)
        `, [reaction.message.id, user.id]);

        // ADD POINT
        db.run(`
            INSERT INTO leaderboard(user_id, username, points)
            VALUES (?, ?, 1)
            ON CONFLICT(user_id)
            DO UPDATE SET
                points = points + 1,
                username = excluded.username
        `, [user.id, user.username]);

        // UPDATE BOARD
        await updateLeaderboard();
    });
});

/*
=====================================
LOGIN
=====================================
*/

client.login(process.env.TOKEN);
