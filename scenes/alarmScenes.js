const { Scenes, Markup, Composer } = require('telegraf');
const mongoose = require("mongoose");
require('dotenv').config();

const setData = require('../utils/setData');
const Alarms = require('../models/Alarms');

const startStep = new Composer();
startStep.on("text", async (ctx) => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    ctx.wizard.state.data = {};
    ctx.wizard.state.data.userId = ctx.message.from.id;
    await ctx.replyWithHTML('Напиши текст напоминания');
    return ctx.wizard.next();
  } catch (e) {
    console.log(e)
  }
})

const timeStep = new Composer();
timeStep.on("text", async (ctx) => {
  try {
    ctx.wizard.state.data.alarmText = ctx.message.text;
    await ctx.replyWithHTML('Укажи время. Например 17:00');
    return ctx.wizard.next();
  } catch (e) {
    console.log(e)
  }
})

const dataStep = new Composer();
dataStep.on("text", async (ctx) => {
  try {
    ctx.wizard.state.data.alarmTime = ctx.message.text;
    await ctx.replyWithHTML('Укажи дату. Например 21.03.2022', Markup.keyboard([
      ['Сегодня', 'Завтра']
    ]).oneTime().resize());
    return ctx.wizard.next();
  } catch (e) {
    console.log(e)
  }
})

const doneStep = new Composer();
doneStep.on("text", async (ctx) => {
  try {
    ctx.wizard.state.data.alarmDate = ctx.message.text;
    const {alarmTime, alarmDate, alarmText, userId} = ctx.wizard.state.data;
    const { timer, expiryTime, utc} = setData(alarmTime, alarmDate);

    if (timer < 0) {
      await ctx.replyWithHTML(`<b>Напоминание не создано!</b>\nУказано время меньше текущего.`, Markup.keyboard([
        ['Создать новое напоминание', 'Активные напоминания']
      ]).oneTime().resize());
      return ctx.scene.leave();
    }

    if (isNaN(timer)) {
      await ctx.replyWithHTML(`<b>Напоминание не создано!</b>\nНе удалось распознать время или дату.`, Markup.keyboard([
        ['Создать новое напоминание', 'Активные напоминания']
      ]).oneTime().resize());
      return ctx.scene.leave();
    }

    const alarm = new Alarms({ userId, time: alarmTime, date: alarmDate, text: alarmText, expiryTime, utc });
    await alarm.save();

    await ctx.replyWithHTML(`<b>Напоминание создано</b>\n${alarmDate} в ${alarmTime}\n${alarmText}`, Markup.keyboard([
      ['Создать новое напоминание', 'Активные напоминания']
    ]).oneTime().resize());

    return ctx.scene.leave();
  } catch (e) {
    console.log(e);
    await ctx.replyWithHTML(`<b>Напоминание не создано!</b>\nЧто-то пошло не так.`, Markup.keyboard([
      ['Создать новое напоминание', 'Активные напоминания']
    ]).oneTime().resize());
    return ctx.scene.leave();
  }
})

const alarmScenes = new Scenes.WizardScene('alarmWizard', startStep, timeStep, dataStep, doneStep);
module.exports = alarmScenes;
