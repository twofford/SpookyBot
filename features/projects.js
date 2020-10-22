const resume = require("../public/assets/resume.json");
const firstName = resume.basics.name.split(' ')[0]

const { BotkitConversation } = require('botkit');

module.exports = function (controller) {

    const quick_replies_projects = [];

    resume.projects.forEach(project => {
        let projectName = project.title
        let projectGithub = `<a href="${project.codeSource}" target="_blank">Code Source</a>`;
        let projectLiveSite = `<a href="${project.liveSite}" target="_blank">Live Site</a>`;
        let highlights = project.highlights.map((highlight) => `<li>${highlight}</li>`).join("");

        let projectMarkup = `<div><h2>${project.title}</h2>${
          project.summary ? `<p>${project.summary}</p>` : ""
        }${
          highlights.length > 0 ? `<h4>Features</h4><ul>${highlights}</ul><br>` : ""
        }
        <p>${projectLiveSite}</p><p>${projectGithub}</p></div>`;

        controller.hears(new RegExp(projectName, "i"), ['message'], async (bot, message) => {


            await bot.reply(message, { type: "typing" });
            setTimeout(async () => {
              // will have to reset context because turn has now ended.
              await bot.changeContext(message.reference);
                await bot.reply(message, `<ul class="project_history">${projectMarkup}</ul>`);
                }, 1000);




            
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