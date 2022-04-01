const { Scenes, Markup, Composer} = require('telegraf');
const mongoose = require("mongoose");
const { timeZone } = require("../constants/timeZone");
const Users = require("../models/Users");
require('dotenv').config();

const {
  KALININGRAD,
  KALININGRAD_ZONE,
  MOSCOW,
  MOSCOW_ZONE,
  SAMARA,
  SAMARA_ZONE,
  EKATERINBURG,
  EKATERINBURG_ZONE,
  OMSK, OMSK_ZONE,
  NOVOSIBIRSK,
  NOVOSIBIRSK_ZONE
} = timeZone;

const startStep = new Composer();
startStep.on("text", async (ctx) => {
  try {
    ctx.wizard.state.data = {};
    ctx.wizard.state.data.userId = ctx.message.from.id;
    await ctx.replyWithHTML('Выбери часовой пояс', Markup.inlineKeyboard([
      [Markup.button.callback(KALININGRAD, KALININGRAD_ZONE)],
      [Markup.button.callback(MOSCOW, MOSCOW_ZONE)],
      [Markup.button.callback(SAMARA, SAMARA_ZONE)],
      [Markup.button.callback(EKATERINBURG, EKATERINBURG_ZONE)],
      [Markup.button.callback(OMSK, OMSK_ZONE)],
      [Markup.button.callback(NOVOSIBIRSK, NOVOSIBIRSK_ZONE)],
    ]));
    return ctx.wizard.next();
  } catch (e) {
    console.log(e);
  }
});

const callbackTimeZone = async (ctx, zone) => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    let user = await Users.findOne({ userId: ctx.wizard.state.data.userId });

    if (user) {
      await Users.updateOne({ userId: ctx.wizard.state.data.userId }, { $set: { utc: ctx.update.callback_query.data, utcString: zone }})
    } else {
      user = new Users({ userId: ctx.wizard.state.data.userId, utc: ctx.update.callback_query.data, utcString: zone });
      await user.save();
    }

    await ctx.replyWithHTML(`Установлен часовой пояс ${zone}`);
    await ctx.replyWithHTML(`Теперь можешь создать напоминание`, Markup.keyboard([
      ['Новое напоминание', 'Активные напоминания']
    ]).oneTime().resize());
    await ctx.scene.enter('startWizard');

    return ctx.scene.leave();
  } catch (e) {
    console.log(e)
  }
};

const timeZoneStep = new Composer();
timeZoneStep.action(KALININGRAD_ZONE, async (ctx) => { await callbackTimeZone(ctx, KALININGRAD)});
timeZoneStep.action(MOSCOW_ZONE, async (ctx) => { await callbackTimeZone(ctx, MOSCOW)});
timeZoneStep.action(SAMARA_ZONE, async (ctx) => { await callbackTimeZone(ctx, SAMARA)});
timeZoneStep.action(EKATERINBURG_ZONE, async (ctx) => { await callbackTimeZone(ctx, EKATERINBURG)});
timeZoneStep.action(OMSK_ZONE, async (ctx) => { await callbackTimeZone(ctx, OMSK)});
timeZoneStep.action(NOVOSIBIRSK_ZONE, async (ctx) => { await callbackTimeZone(ctx, NOVOSIBIRSK)});

const activeAlarmScenes = new Scenes.WizardScene('timeZoneWizard', startStep, timeZoneStep);
module.exports = activeAlarmScenes;
