import 'dotenv/config.js';
import { bot } from './bot.js';

bot.login(process.env.TOKEN);