const resume = require("../public/assets/resume.json");

module.exports = function (controller) {

  const skillsStr = resume.skills.map((obj) => {
    if (obj.level > 1) {
        return `${obj.name}: ${obj.level} years`;
    } else {
        return `${obj.name}: ${obj.level} year`;
    }
  }).join(', ');

  
  controller.hears("skills", "message", async (bot, message) => {
    await bot.reply(
      message,
      `${resume.basics.name} knows the following stuff: ${skillsStr}.`
    );
  });

  controller.hears("tech", "message", async (bot, message) => {
    await bot.reply(
      message,
      `${resume.basics.name} knows the following stuff: ${skillsStr}`
    );
  });

  controller.hears("stack", "message", async (bot, message) => {
    await bot.reply(
      message,
      `${resume.basics.name} knows the following stuff: ${skillsStr}`
    );
  });
};
