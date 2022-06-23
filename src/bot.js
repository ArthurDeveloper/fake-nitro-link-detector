import commands from './commands/index.js';
import * as discord from 'discord.js';

const { Client, Intents } = discord;

const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const prefix = process.env.PREFIX;
console.log(String(process.env.TOKEN));

bot.on('messageCreate', (msg) => {
    if (msg.author.bot) {
        return;
    }

    for (const command of commands) {
        console.log(command)
        if (msg.content === prefix+command.name) {
            command.run(msg);
        }
    }
});

export default bot;