import commands from './commands/index.js';
import Detector from './detector/Detector.js';
import * as discord from 'discord.js';

const { Client, Intents } = discord;

export const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
export let prefix = process.env.PREFIX ?? '!';
export function setPrefix(newPrefix) {
    prefix = newPrefix;
}

console.log(String(process.env.TOKEN));

bot.on('messageCreate', (msg) => {
    if (msg.author.bot) {
        return;
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
