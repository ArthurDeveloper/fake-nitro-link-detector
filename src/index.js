import 'dotenv/config.js';

console.log(process.env.PREFIX)

import bot from './bot.js';

bot.on('ready', () => {
    console.log('Bot running!')
});


bot.login(process.env.TOKEN);