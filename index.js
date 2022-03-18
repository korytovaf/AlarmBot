const { Telegraf, Scenes, Markup, session} = require('telegraf');
const mongoose = require("mongoose");
require('dotenv').config();

const alarmScenes = require('./scenes/alarmScenes.js');
const activeAlarmScenes = require('./scenes/activeAlarmScenes.js');
const Alarms = require("./models/Alarms");
const { info } = require('./utils/const')

const bot = new Telegraf(process.env.BOT_TOKEN);

const stage = new Scenes.Stage([alarmScenes, activeAlarmScenes]);

bot.use(session());
bot.use(stage.middleware());

bot.hears('Создать новое напоминание', ctx => ctx.scene.enter('alarmWizard'))
bot.hears('Активные напоминания', ctx => ctx.scene.enter('activeAlarmWizard'))

bot.start(async ctx => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    setInterval(async () => {
      const currentDate = new Date();
      const alarms = await Alarms.find({ userId: ctx.message.from.id });

      alarms.map( async (alarm) => {
        console.log(+alarm.expiryTime, currentDate.getTime() - currentDate.getTimezoneOffset()*60*1000);
        console.log(currentDate.getTimezoneOffset()*60*1000)
        if (alarm.expiryTime < currentDate.getTime() + currentDate.getTimezoneOffset()*60*1000) {
          await Alarms.deleteOne({ _id: alarm._id });
          await ctx.replyWithHTML(`<b>⏰ ${alarm.time}</b> \n ${alarm.text}`);
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
