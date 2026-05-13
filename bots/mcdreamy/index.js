require('dotenv').config();

const {
    Client,
    GatewayIntentBits,
    Partials,
    EmbedBuilder,
    PermissionsBitField
} = require('discord.js');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./mcdreamy.db');

/*
=====================================
SAFETY NET
=====================================
*/
process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);

/*
=====================================
CONFIG
=====================================
*/
const EMOJI = '💉';
const LEADERBOARD_CHANNEL_ID = process.env.LEADERBOARD_CHANNEL_ID;

/*
=====================================
VALIDATION
=====================================
*/
if (!process.env.TOKEN) throw new Error("Missing TOKEN");
if (!LEADERBOARD_CHANNEL_ID) throw new Error("Missing LEADERBOARD_CHANNEL_ID");

/*
=====================================
CLIENT
=====================================
*/
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageContent
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
db.run(`CREATE TABLE IF NOT EXISTS leaderboard (
    user_id TEXT PRIMARY KEY,
    username TEXT,
    points INTEGER DEFAULT 0
)`);

db.run(`CREATE TABLE IF NOT EXISTS claims (
    message_id TEXT PRIMARY KEY,
    claimed_by TEXT
)`);

db.run(`CREATE TABLE IF NOT EXISTS config (
    key TEXT PRIMARY KEY,
    value TEXT
)`);

db.run(`CREATE TABLE IF NOT EXISTS groups (
    role_id TEXT PRIMARY KEY,
    group_name TEXT
)`);

db.run(`CREATE TABLE IF NOT EXISTS group_points (
    group_name TEXT PRIMARY KEY,
    points INTEGER DEFAULT 0
)`);

db.run(`CREATE TABLE IF NOT EXISTS seasons (
    key TEXT PRIMARY KEY,
    value TEXT
)`);

/*
=====================================
SEASON
=====================================
*/
function getSeasonKey() {
    const d = new Date();
    const q = Math.floor(d.getMonth() / 3) + 1;
    return `Q${q}-${d.getFullYear()}`;
}

/*
=====================================
READY
=====================================
*/
client.once('ready', async () => {
    console.log(`💉 Online as ${client.user.tag}`);

    await ensureLeaderboardMessage();
    await ensureGroupMessage();

    await checkSeasonReset();
    setInterval(checkSeasonReset, 60 * 60 * 1000); // hourly check

    await updateLeaderboard();
    await updateGroupLeaderboard();
});

/*
=====================================
LEADERBOARD MESSAGE
=====================================
*/
async function ensureLeaderboardMessage() {
    const channel = await client.channels.fetch(LEADERBOARD_CHANNEL_ID);
    if (!channel) return;

    db.get(`SELECT value FROM config WHERE key='leaderboard_message'`, async (err, row) => {
        if (err || row) return;

        const msg = await channel.send({
            embeds: [buildEmbed("No activity yet.")]
        });

        db.run(`INSERT INTO config(key,value) VALUES('leaderboard_message',?)`, [msg.id]);
    });
}

/*
=====================================
GROUP MESSAGE (IMPORTANT FIX)
=====================================
*/
async function ensureGroupMessage() {
    const channel = await client.channels.fetch(LEADERBOARD_CHANNEL_ID);
    if (!channel) return;

    db.get(`SELECT value FROM config WHERE key='group_message'`, async (err, row) => {
        if (err || row) return;

        const msg = await channel.send({
            embeds: [buildEmbed("No group activity yet.")]
        });

        db.run(`INSERT INTO config(key,value) VALUES('group_message',?)`, [msg.id]);
    });
}

/*
=====================================
USER LEADERBOARD
=====================================
*/
async function updateLeaderboard() {

    db.get(`SELECT value FROM config WHERE key='leaderboard_message'`, async (err, row) => {
        if (err || !row) return;

        const channel = await client.channels.fetch(LEADERBOARD_CHANNEL_ID);
        const message = await channel.messages.fetch(row.value);

        db.all(`SELECT username, points FROM leaderboard ORDER BY points DESC LIMIT 50`, async (err, rows) => {
            if (err) return;

            const text = buildBoard(rows, "💉 User Leaderboard");

            await message.edit({ embeds: [buildEmbed(text)] });
        });
    });
}

/*
=====================================
GROUP LEADERBOARD (FIXED NO SPAM)
=====================================
*/
async function updateGroupLeaderboard() {

    db.get(`SELECT value FROM config WHERE key='group_message'`, async (err, row) => {
        if (err || !row) return;

        const channel = await client.channels.fetch(LEADERBOARD_CHANNEL_ID);
        const message = await channel.messages.fetch(row.value);

        db.all(`SELECT group_name, points FROM group_points ORDER BY points DESC LIMIT 10`, async (err, rows) => {
            if (err) return;

            const text = buildBoard(rows, "🏥 Group Leaderboard");

            await message.edit({ embeds: [buildEmbed(text)] });
        });
    });
}

/*
=====================================
SEASON RESET (SAFE LOOP)
=====================================
*/
async function checkSeasonReset() {

    const current = getSeasonKey();

    db.get(`SELECT value FROM seasons WHERE key='current'`, async (err, row) => {

        if (!row) {
            db.run(`INSERT INTO seasons(key,value) VALUES('current',?)`, [current]);
            return;
        }

        if (row.value === current) return;

        const channel = await client.channels.fetch(LEADERBOARD_CHANNEL_ID);

        const topUser = await getTopUser();
        const topGroup = await getTopGroup();

        await channel.send({
            embeds: [new EmbedBuilder()
                .setTitle(`🏁 Season Complete — ${row.value}`)
                .setDescription(
`**Top User:** ${topUser || 'None'}
**Top Group:** ${topGroup || 'None'}

Scores have been reset for the new quarter.`
                )
            ]
        });

        db.run(`UPDATE leaderboard SET points=0`);
        db.run(`UPDATE group_points SET points=0`);
        db.run(`UPDATE seasons SET value=? WHERE key='current'`, [current]);
    });
}

/*
=====================================
REACTIONS
=====================================
*/
client.on('messageReactionAdd', async (reaction, user) => {

    if (user.bot) return;
    if (reaction.partial) await reaction.fetch();
    if (reaction.emoji.name !== EMOJI) return;

    const member = await reaction.message.guild.members.fetch(user.id);

    db.get(`SELECT * FROM claims WHERE message_id=?`, [reaction.message.id], (err, row) => {

        if (row) return reaction.users.remove(user.id).catch(() => {});

        db.run(`INSERT INTO claims(message_id,claimed_by) VALUES(?,?)`,
            [reaction.message.id, user.id]);

        db.run(`
            INSERT INTO leaderboard(user_id,username,points)
            VALUES(?,?,1)
            ON CONFLICT(user_id)
            DO UPDATE SET points=points+1, username=excluded.username
        `, [user.id, user.username]);

        db.all(`SELECT role_id, group_name FROM groups`, (err, rows) => {
            if (err || !rows) return;

            const match = rows.find(r => member.roles.cache.has(r.role_id));

            if (match) {
                db.run(`
                    INSERT INTO group_points(group_name,points)
                    VALUES(?,1)
                    ON CONFLICT(group_name)
                    DO UPDATE SET points=points+1
                `, [match.group_name]);
            }
        });

        updateLeaderboard();
        updateGroupLeaderboard();
    });
});

/*
=====================================
ADMIN COMMANDS
=====================================
*/
client.on('messageCreate', async (message) => {

    if (message.author.bot) return;
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;

    const args = message.content.split(/\s+/);
    const cmd = args[0];

    // GROUP MAPPING COMMAND
    if (cmd === '!groupmap') {
        const role = message.mentions.roles.first();
        const name = args.slice(2).join(' ');

        if (!role || !name) {
            return message.reply("Usage: !groupmap @Role GroupName");
        }

        db.run(`
            INSERT INTO groups(role_id, group_name)
            VALUES(?,?)
            ON CONFLICT(role_id)
            DO UPDATE SET group_name=excluded.group_name
        `, [role.id, name]);

        return message.reply(`Mapped ${role.name} → ${name}`);
    }

    if (cmd !== '!add' && cmd !== '!remove') return;

    const user = message.mentions.users.first();
    if (!user) return message.reply("Mention a user");

    const amount = parseInt(args[2] || "1");
    if (isNaN(amount)) return message.reply("Invalid number");

    const delta = cmd === '!add' ? amount : -amount;

    db.run(`
        INSERT INTO leaderboard(user_id,username,points)
        VALUES(?,?,?)
        ON CONFLICT(user_id)
        DO UPDATE SET points=points+?, username=excluded.username
    `, [user.id, user.username, delta, delta]);

    await updateLeaderboard();
    message.reply(`${cmd === '!add' ? 'Added' : 'Removed'} ${Math.abs(delta)} points`);
});

/*
=====================================
UTILS
=====================================
*/
function buildBoard(rows, title) {
    let text = `${title}\n\n`;

    if (!rows || rows.length === 0) return text + "No data.";

    rows.forEach((r, i) => {
        const medal =
            i === 0 ? '🥇' :
            i === 1 ? '🥈' :
            i === 2 ? '🥉' :
            `${i + 1}.`;

        text += `${medal} ${r.username || r.group_name} — ${r.points} 💉\n`;
    });

    return text;
}

function buildEmbed(boardText) {
    return new EmbedBuilder()
        .setTitle(`💉 Quarterly Responder Leaderboard — ${getSeasonKey()}`)
        .setDescription(
`**What this is**
This system tracks the top responders each quarter.

**How it works**
- React with 💉 to award a point
- Each message counts once per user
- Points reset every quarter

---

**Leaderboard**
${boardText}`
        )
        .setFooter({ text: `Updated ${new Date().toLocaleString()}` });
}

async function getTopUser() {
    return new Promise(res => {
        db.get(`SELECT username,points FROM leaderboard ORDER BY points DESC LIMIT 1`, (e,r)=>{
            res(r ? `${r.username} — ${r.points}` : null);
        });
    });
}

async function getTopGroup() {
    return new Promise(res => {
        db.get(`SELECT group_name,points FROM group_points ORDER BY points DESC LIMIT 1`, (e,r)=>{
            res(r ? `${r.group_name} — ${r.points}` : null);
        });
    });
}

client.login(process.env.TOKEN);