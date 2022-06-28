const Ping = {
    name: 'ping',
    description: 'Replies \'Pong!\' to you.',
    
    run(ctx, params) {
        ctx.reply('Pong!');
    }
}

export default Ping;