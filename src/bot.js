import commands from './commands/index.js';
import Detector from './services/Detector.js';
import * as discord from 'discord.js';
import Server from './services/Server.js';

const { Client, Intents, DiscordAPIError } = discord;

export const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
export const defaultPrefix = process.env.DEFAULT_PREFIX ?? '!';

export let servers;

Server.retrieveAll((err, rows) => {
    if (err) {
        console.log('Error while trying to retrieve servers: '+err);
        return;
    }

    servers = rows;
});

export function updateServerArray({ 
    server,
    newName,
    newPrefix,
    newPunishment
}) {
    const index = servers.map((serverParam, index) => {
        if (serverParam.name === server) {
            return index;
        }
    });
    
    if (newName) servers[index].name = newName;
    if (newPrefix) servers[index].bot_prefix = newPrefix;
    if (newPunishment) servers[index].punishment = newPunishment;
}

export function addServerToServerArray({
    name
}) {
    servers.push({
        name,
        bot_prefix: defaultPrefix,
        punishment: null
    });

    return;
}

bot.on('ready', (ctx) => {
    console.log('Bot ready!');
});

bot.on('guildCreate', (guild) => {
    Server.add(guild.name);
    servers.push({ name: guild.name, prefix: defaultPrefix });

    let hasWelcomeMessageBeenSent = false;
    guild.channels.cache.map(channel => {
        if (channel.type === 'GUILD_TEXT' &&
            channel.permissionsFor(guild.me).has('SEND_MESSAGES') &&
            !hasWelcomeMessageBeenSent) {
            channel.send(`
@here
Howdy!

I'm FakeNitroLinkDetector, a bot who'll automatically detect scam links claiming to
give you nitro for free.

My default prefix here is \`\`${defaultPrefix}\`\`, and you can see some commands of mine with 
\`\`${defaultPrefix}help\`\`. If you forget my prefix, just mention me and I will tell you it.

G'bye!
            `);

            hasWelcomeMessageBeenSent = true;
    }});
});

bot.on('messageCreate', (msg) => {
    if (msg.author.bot) {
        return;
    }

    const messageMentionsBot = msg.mentions.users.filter(user => user.username === 'FakeNitroLinkDetector').size > 0;

    const prefix = servers.map(server => {
        if (server.name === msg.guild.name) {
            return server.bot_prefix;
        }
    })[0].toString() ?? '!';

    if (messageMentionsBot) {
        msg.reply(`Your server\'s prefix is \`\`${prefix}\`\`.\n
You can change it with \`\`${prefix}set-prefix new-prefix\`\``);
    }

    if (Detector.isThereFakeLink(msg.content)) {
        const guildPunishment = servers.map(server => {
            if (server.name === msg.guild.name) {
                return server.punishment;
            }
        }).toString();

        if (guildPunishment === 'ban') {
            if (msg.channel.permissionsFor(msg.guild.me).has('BAN_MEMBERS')) {
                msg.reply('Gotcha, scammer! You won\'t send such links in this server anymore!');
                msg.guild.members.ban(msg.author, { reason: 'Gotcha, scammer!' });
                return;
            }

            msg.channel.send('Sorry, I do not have permissions to ban that scammer.');
        } else if (guildPunishment === 'kick') {
            if (msg.channel.permissionsFor(msg.guild.me).has('KICK_MEMBERS')) {
                msg.reply('Gotcha, scammer! You won\'t send such links in this server anymore!');
                msg.guild.members.kick(msg.author, { reason: 'Gotcha, scammer!' });
                return;
            }

            msg.channel.send('Sorry, I do not have permissions to kick that scammer.');
        } else if (guildPunishment.split(' ')[0] === '--send-message') {
            msg.reply(guildPunishment.split(' ')[1]);
        } else {
            msg.reply('Gotcha, scammer!');
        }

        return;
    }

    for (const command of commands) {
        msg.content = msg.content.trim().toLowerCase();
        if (msg.content.startsWith(prefix+command.name)) {
            const params = msg.content.split(' ');
            params.shift();

            command.run(msg, params);
        }
    }
});
