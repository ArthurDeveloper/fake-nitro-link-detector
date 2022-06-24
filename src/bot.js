import commands from './commands/index.js';
import Detector from './detector/Detector.js';
import * as discord from 'discord.js';
import findUrlInString from './util/findUrlsInString.js';

const { Client, Intents } = discord;

const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const prefix = process.env.PREFIX;
console.log(String(process.env.TOKEN));

bot.on('messageCreate', (msg) => {
    if (msg.author.bot) {
        return;
    }

    console.log(findUrlInString(msg.content));

    if (Detector.isThereFakeLink(msg.content)) {
        msg.reply('Gotcha, scammer!');
        return;
    }

    for (const command of commands) {
        if (msg.content.trim().toLowerCase() === prefix+command.name) {
            command.run(msg);
        }
    }
});

export default bot;