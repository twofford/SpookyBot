const resume = require("../public/assets/resume.json");
const firstName = resume.basics.name.split(' ')[0]

const { BotkitConversation } = require('botkit');

module.exports = function (controller) {

    const projectNames = [];
    const quick_replies_projects = [];

    resume.projects.forEach(name => {
        projectNames.push(name.title)
        quick_replies_projects.push({
            title: `${name.title}`,
            payload: `${name.title}`
        })
    });

    resume.projects.forEach(name => {
        // let place = new RegExp(name.institution)
        let place = name.institution
        let partial = name.institution.split(' ')[0]
        controller.hears(new RegExp(place, "i"), ['message'], async (bot, message) => {
            await bot.reply(message, `${firstName} attended ${name.institution} from 
            ${name.startDate} to ${name.endDate}. They pursued a ${name.studyType} for ${name.area}.`);
        });
        controller.hears(new RegExp(partial, "i"), ['message'], async (bot, message) => {
            await bot.reply(message, `${firstName} attended ${name.institution} from 
            ${name.startDate} to ${name.endDate}. They pursued a ${name.studyType} for ${name.area}.`);
        });
    });

    controller.hears(new RegExp(/education|college|school|bootcamp|boot/, "i"), ['message'], async (bot, message) => {
        await bot.reply(message, {
            text: `Here is ${firstName}'s list of educational institutions.`,
            quick_replies: quick_replies_institutions
        })
    });

    const educationInfo = new BotkitConversation('educationInfo', controller);


};