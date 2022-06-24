const Ping = {
    name: 'ping',
    
    run(ctx, params) {
        ctx.reply('Pong!');
    }
}

export default Ping;