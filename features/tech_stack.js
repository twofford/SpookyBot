const resume = require("../public/assets/resume.json");

module.exports = function (controller) {

  // const skillsStr = resume.skills.map((obj) => {
  //   if (obj.level > 1) {
  //       return `${obj.name}: ${obj.level} years`;
  //   } else {
  //       return `${obj.name}: ${obj.level} year`;
  //   }
  // }).join(', ');

  const skills = resume.skills.map(obj => {
    return {name: obj.name, level: obj.level}
  });

  let skillsStr = '';

  skills.forEach(skill => {
    if (skill.level > 1) {
      skillsStr = skillsStr.concat(`<li>${skill.name}: ${skill.level} years</li>`)
    } else {
      skillsStr = skillsStr.concat(`<li>${skill.name}: ${skill.level} year</li>`)
    }
  })

  controller.hears(/skills|tech|stack/i, "message", async (bot, message) => {
    await bot.reply(message, { type: 'typing' });
    setTimeout(async () => {
      // will have to reset context because turn has now ended.
      await bot.changeContext(message.reference);
      await bot.reply(
        message,
        `${resume.basics.name} knows the following stuff: ${skillsStr}`
      );
    }, 1000);
  });
};
