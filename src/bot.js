import commands from './commands/index.js';
import Detector from './services/Detector.js';
import * as discord from 'discord.js';
import Server from './services/Server.js';

const { Client, Intents } = discord;

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
    newPrefix
}) {
    servers[servers.map((serverParam, index) => {
        if (serverParam.name === server) {
            return index;
        }
    })] = { 
        name: newName,
        bot_prefix: newPrefix
    };
}

bot.on('ready', (ctx) => {
    console.log('Bot ready!');
});

bot.on('guildCreate', (guild) => {
    Server.add(guild.name);
    servers.push({ name: guild.name, prefix: defaultPrefix });

    guild.channels.cache.at(0).send(`
Howdy! I'm FakeNitroLinkDetector, a bot who'll automatically detect scam links claiming to
give you nitro for free.

My default prefix here is \`\`!\`\`, and you can see some commands of mine with \`\`!help\`\`.
If you forget my prefix, just mention me and I will tell you it.

G'bye!
`);
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
    }) ?? '!';

    if (messageMentionsBot) {
        msg.reply(`Your server\'s prefix is \`\`${prefix}\`\`.\n
You can change it with \`\`${prefix}set-prefix new-prefix\`\``);
    }

    if (Detector.isThereFakeLink(msg.content)) {
        msg.reply('Gotcha, scammer!');
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
