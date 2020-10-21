const resume = require("../public/assets/resume.json");

module.exports = function (controller) {

    controller.interrupts('help', 'message', async(bot, message) => {
        await bot.reply(
          message,
          "💀: Hey, no problem! Let me take you back to the beginning."
        );
        await bot.beginDialog("return_welcome");
    })

    controller.interrupts('quit', 'message', async(bot, message) => {
        await bot.reply(
          message,
          "💀: OK, no big deal. Feel free to close the tab!"
        );
    })
}