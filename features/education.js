// Sections to include: 1. Institution 2. Dates attended 3. Degree 4. Focus 5. Notes 5. GPA

const resume = require("../public/assets/resume-ezra.json");

module.exports = function (controller) {

    // use a function to match a condition in the message
    controller.hears(async (message) => message.text && message.text.toLowerCase() === 'basic', ['message'], async (bot, message) => {
        await bot.reply(message, `I am ${resume.basics.name}`);
    });

};
