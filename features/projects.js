const resume = require("../public/assets/resume.json");
const firstName = resume.basics.name.split(' ')[0]

const { BotkitConversation } = require('botkit');

module.exports = function (controller) {

    const quick_replies_projects = [];
    const projectMarkup = resume.projects.map(project => {
        
    })

    resume.projects.forEach(name => {
        let projectName = name.title

        controller.hears(new RegExp(projectName, "i"), ['message'], async (bot, message) => {
            await bot.reply(message, `<ul class="project_history">${projectMarkup}</ul>`);
        });

        quick_replies_projects.push({
            title: `${projectName}`,
            payload: `${projectName}`
        })
    });

    controller.hears(new RegExp(/project|portfolio|experience/, "i"), ['message'], async (bot, message) => {
        await bot.reply(message, {
            text: `Here is ${firstName}'s list of projects.`,
            quick_replies: quick_replies_projects
        })
    });

};