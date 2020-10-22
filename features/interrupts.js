const resume = require("../public/assets/resume.json");

module.exports = function (controller) {

    controller.interrupts(/help|menu/i, 'message', async(bot, message) => {
        await bot.reply(
          message,
          "💀: By Skeleton Law, I am bound to assist you. Let me take you back to the beginning."
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