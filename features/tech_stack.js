const resume = require("../public/assets/resume_taylor.json");

module.exports = function(controller){

    const skillsStr = resume.skills.map(obj => obj.name).join(', ');

    controller.hears('tech stack', 'message', async (bot, message) => {
        await bot.reply(message, `Here are my skills: ${skillsStr}`)
    })
};