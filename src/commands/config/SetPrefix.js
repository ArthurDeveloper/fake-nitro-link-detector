import { prefix, setPrefix } from '../../bot.js';

const SetPrefix = {
    name: 'set-prefix',

    run(ctx, params) {
        setPrefix(params[0]);
        ctx.reply(
        `Prefix succefully set to ${prefix}\n`+
        `To run some commands with it, type \`\`${prefix}your-command\`\``
        );
    }
}

export default SetPrefix;