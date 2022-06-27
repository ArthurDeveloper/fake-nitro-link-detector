import Ping from './Ping.js';
import SetPrefix from './config/SetPrefix.js';
import SetPunishment from './config/SetPunishment.js';

const commands = [
    Ping,
    SetPrefix,
    SetPunishment
];

commands.push({
    name: 'help',
    description: 'Shows information about this bot\'s commands.',

    run(ctx, params) {
        ctx.reply(`Hello! These are my commands:\n
${commands.map(command => {
    return `\`\`${command.name}: ${command.description}\`\`\n\n`
}).toString().replaceAll(',', '')}`);
    }
})

export default commands;