module.exports = function (controller) {
  controller.on("message,direct_message", async (bot, message) => {
    await bot.reply(
      message,
      `💀: Sorry, I don't know what "${message.text}" is. Probably because I'm just a brainless skeleton. You can ask me for "help" to get things back on track. You have to ask, though. It's Skeleton Law.`
    );
  });
};
