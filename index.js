const { Telegraf, Scenes, Markup, session} = require('telegraf');
const mongoose = require("mongoose");
require('dotenv').config();

const alarmScenes = require('./scenes/alarmScenes.js');
const activeAlarmScenes = require('./scenes/activeAlarmScenes.js');
const timeZoneScenes = require('./scenes/timeZoneScenes.js');

const Alarms = require("./models/Alarms");
const Users = require("./models/Users");

const { info } = require('./utils/const')
const convertDataTime = require("./utils/convertDataTime");

const bot = new Telegraf(process.env.BOT_TOKEN);

const stage = new Scenes.Stage([alarmScenes, activeAlarmScenes, timeZoneScenes]);

bot.use(session());
bot.use(stage.middleware());

bot.hears('Создать новое напоминание', ctx => ctx.scene.enter('alarmWizard'));
bot.hears('Активные напоминания', ctx => ctx.scene.enter('activeAlarmWizard'));
bot.hears('/time_zone', ctx => ctx.scene.enter('timeZoneWizard'))

bot.start(async ctx => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    setInterval(async () => {
      const alarms = await Alarms.find({ userId: ctx.message.from.id });
      const { utc } = await Users.findOne({ userId: ctx.message.from.id });

      alarms.map( async ({ _id, utcExpiryTime, alarmText }) => {
        const { time } = convertDataTime(utcExpiryTime);
        const currentDate = new Date();

        console.log('текущее время       ', new Date(+currentDate + utc*3600*1000));
        console.log('установленное время ', utcExpiryTime);

        if (utcExpiryTime <= new Date(+currentDate + utc*3600*1000)) {
          await Alarms.deleteOne({ _id });
          await ctx.replyWithHTML(`<b>⏰ ${time}</b> \n ${alarmText}`);
        }
      })
    }, 1000);

    await ctx.reply('Привет', Markup.keyboard([
      ['Создать новое напоминание', 'Активные напоминания']
    ]).oneTime().resize());
  } catch (e) {
    console.log(e)
  }
});

bot.help(async ctx => {
  try {
    await ctx.replyWithHTML(info);
  } catch (e) {
    console.log(e)
  }
});

bot.launch();
