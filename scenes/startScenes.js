const { Scenes, Composer, Markup} = require('telegraf');
const mongoose = require("mongoose");
const Users = require("../models/Users");
const Alarms = require("../models/Alarms");
const convertDataTime = require("../utils/convertDataTime");
require('dotenv').config();

const startStep = new Composer();
startStep.on("text", async (ctx) => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const user = await Users.findOne({ userId: ctx.message.from.id });
    if (!user) {
      await ctx.scene.enter('timeZoneWizard');
      // await ctx.reply('Привет, для начала нужно настроить часовой пояс. Отправь команду /time_zone', ctx => ctx.scene.enter('timeZoneWizard'));
      return;
    }

    setInterval(async () => {
      const alarms = await Alarms.find({ userId: ctx.message.from.id });
      alarms.map( async ({ _id, utcExpiryTime, alarmText }) => {
        const { time } = convertDataTime(utcExpiryTime);
        const currentDate = new Date();

        if (utcExpiryTime <= new Date(+currentDate + user.utc*3600*1000)) {
          await Alarms.deleteOne({ _id });
          await ctx.replyWithHTML(`<b>⏰ ${time}</b> \n ${alarmText}`);
        }
      })
    }, 1000);

    await ctx.reply('Создай новое напоминание', Markup.keyboard([
      ['Новое напоминание', 'Активные напоминания']
    ]).oneTime().resize());
    return ctx.scene.leave();
  } catch (e) {
    console.log(e)
  }
});

const startScenes = new Scenes.WizardScene('startWizard', startStep);
module.exports = startScenes;
