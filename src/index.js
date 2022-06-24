import 'dotenv/config.js';

import bot from './bot.js';

bot.on('ready', () => {
    console.log('Bot running!')
});

bot.login(process.env.TOKEN);