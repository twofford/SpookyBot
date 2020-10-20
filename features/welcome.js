const resume = require("../public/assets/resume_taylor.json");

module.exports = function(controller){
    
    controller.on("hello", async (bot, message) => {
      await bot.reply(
        message,
        `Hello there, I'm SpookyBot! I exist to tell you about ${resume.basics.name}. I see that this is your first time here. I know the following stuff about ${resume.basics.name}:`
      );
    });

    controller.on("welcome_back", async (bot, message) => {
      await bot.reply(
        message,
        `Welcome back! As you know, I'm SpookyBot. I exist to tell you about ${resume.basics.name}. I know the following stuff about ${resume.basics.name}:`
      );
    });
}