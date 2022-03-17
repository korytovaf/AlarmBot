const { Scenes, Markup, Composer} = require('telegraf');
const mongoose = require("mongoose");
require('dotenv').config();

const Alarms = require('../models/Alarms');
let alarms = [];

const startStep = new Composer();
startStep.on("text", async (ctx) => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    ctx.wizard.state.alarmsActive = [];

    alarms = await Alarms.find({userId: ctx.message.from.id});
    alarms.sort((a,b) => a.expiryTime - b.expiryTime);

    let text = `<b>Активные напоминания</b>\n\n`;
    alarms.map((alarm, i) => {
      text = text + `<b>${i + 1}.</b> ${alarm.date} в ${alarm.time}\n${alarm.text}\n\n`
    });

    if (alarms.length <= 0) {
      await ctx.replyWithHTML('Нет активных напоминаний');
      return ctx.scene.leave();
    }
    await ctx.replyWithHTML(text, Markup.keyboard([
      ['Создать новое напоминание', 'Активные напоминания']
    ]).oneTime().resize());

    return ctx.scene.leave();
  } catch (e) {
    console.log(e);
  }
})

const activeAlarmScenes = new Scenes.WizardScene('activeAlarmWizard', startStep);
module.exports = activeAlarmScenes;
