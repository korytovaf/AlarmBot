const { Telegraf, Scenes, session} = require('telegraf');
require('dotenv').config();

const alarmScenes = require('./scenes/alarmScenes.js');
const activeAlarmScenes = require('./scenes/activeAlarmScenes.js');
const timeZoneScenes = require('./scenes/timeZoneScenes.js');
const helpScenes = require('./scenes/helpScenes.js');
const startScenes = require('./scenes/startScenes.js');

const bot = new Telegraf(process.env.BOT_TOKEN);
const stage = new Scenes.Stage([alarmScenes, activeAlarmScenes, timeZoneScenes, helpScenes, startScenes]);

bot.use(session());
bot.use(stage.middleware());

bot.start(async ctx => ctx.scene.enter('startWizard'));
bot.help(ctx => ctx.scene.enter('helpWizard'));

bot.hears('Новое напоминание', ctx => ctx.scene.enter('alarmWizard'));
bot.hears('Активные напоминания', ctx => ctx.scene.enter('activeAlarmWizard'));
bot.hears('/time_zone', ctx => ctx.scene.enter('timeZoneWizard'));


bot.launch();
