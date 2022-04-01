const { Scenes, Composer} = require('telegraf');
const mongoose = require("mongoose");
const Users = require("../models/Users");
require('dotenv').config();

const startStep = new Composer();
startStep.on("text", async (ctx) => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const user = await Users.findOne({ userId: ctx.update.message.from.id });
    await ctx.replyWithHTML(`Сервис создания коротких напоминаний.\n<b>Часовой пояс:</b> ${user.utcString}`);
    return ctx.scene.leave();
  } catch (e) {
    console.log(e)
  }
});

const helpScenes = new Scenes.WizardScene('helpWizard', startStep);
module.exports = helpScenes;
