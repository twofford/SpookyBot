const resume = require("../public/assets/resume.json");

module.exports = function (controller) {
  const firstName = resume.basics.name.split(' ')[0];


  const skills = resume.skills.map(skill => {
    const levelMarkup = skill.level > 1 ? `${skill.level} years` : `${skill.level} year`;
    return { name: skill.name, levelMarkup: levelMarkup};
  });

  //Generate a bot listener for each skill
  skills.forEach(skill => {
    const query = skill.name.toLowerCase();
    return controller.hears(new RegExp(query, 'i'), ['message'], async (bot, message) => {
      await bot.reply(message, { type: 'typing' });
      setTimeout(async () => {
        // will have to reset context because turn has now ended.
        await bot.changeContext(message.reference);
        await bot.reply(message, `${firstName} has ${skill.levelMarkup} of experience with ${skill.name}.`);
      }, 1000);
    });
  });

  controller.hears(/skills|tech|stack/i, "message", async (bot, message) => {
    await bot.reply(message, { type: 'typing' });
    setTimeout(async () => {
      // will have to reset context because turn has now ended.
      await bot.changeContext(message.reference);
      await bot.reply(
        message,
        `${resume.basics.name} knows the following stuff: ${`<ul>${skills.map(skill => `<li>${skill.name}: ${skill.levelMarkup}</li>`).join('')}</ul>`}`
      );
    }, 1000);
  });
};
