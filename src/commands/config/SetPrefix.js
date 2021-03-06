import Server from '../../services/Server.js';

const SetPrefix = {
    name: 'set-prefix',
    description: 'Change server\'s prefix',

    run(ctx, params) {
        if (ctx.channel.permissionsFor(ctx.author).has('ADMINISTRATOR')) {
            const server = ctx.guild.name;
            const newPrefix = params[0];

            if (!newPrefix) {
                ctx.reply('You must pass the prefix you want in the command.');
                return;
            }

            Server.setPrefix(
            {
                server,
                prefix: newPrefix
            },
            (err) => {
                if (err) {
                    ctx.reply('Error while trying to change this server\'s prefix');
                    console.log('Error while trying to change this server\'s prefix'+err);
                    return;
                }
            });

	    ctx.reply(
                `Prefix succefully set to ${newPrefix}\n`+
                `To run some commands with it, type \`\`${newPrefix}your-command\`\``
            );

            return;
        }

        ctx.reply('Sorry, you need to be an admin to change this server\'s prefix');
    }
}

export default SetPrefix;