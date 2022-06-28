import Server from '../../services/Server.js';

const SetPunishment = {
    name: 'set-punishment',
    description: `Sets a punishment to users that send fake links. It can be ban, 
kick, or you can use send-message followed by a message to send a warning message or 
run a command in another bot.`,

    run(ctx, params) {
        if (ctx.channel.permissionsFor(ctx.author).has('ADMINISTRATOR')) {
            const punishment = params[0].trim().toLowerCase() ?? '';

            function handlePunishmentSet(err) {
                if (err) {
                    console.log('Error while trying to set punishment '+err);
                }
            }

            if (punishment === '--send-message') {
                Server.setPunishment({
                    server: ctx.guild.name,
                    punishment: `${punishment} ${params[1]}`
                }, handlePunishmentSet);

                ctx.reply(`
Punishment succefully set. When a scammer send some fake link, they will see the message 
\`\`${params[1]}\`\``);
                return;
            }

            if (['ban', 'kick'].includes(punishment)) {
                Server.setPunishment({
                    server: ctx.guild.name,
                    punishment
                }, handlePunishmentSet);

                ctx.reply(`Punishment succefully set to \`\`${punishment}\`\``);
                return;
            }

            ctx.reply('Invalid punishment!');
            return;
        }

        ctx.reply('Sorry, you need to be an admin to change this server\'s punishment.');
    }
}

export default SetPunishment;