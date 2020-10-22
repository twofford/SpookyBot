const resume = require("../public/assets/resume.json");
const firstName = resume.basics.name.split(' ')[0]

const { BotkitConversation } = require('botkit');

module.exports = function (controller) {

    const quick_replies_projects = [];
    // const projectMarkup = resume.projects.map(project => {
    //     const highlights = project.highlights
    //       .map((highlight) => `<li>${highlight}</li>`)
    //       .join("");

        // const github = `<a href="${project.codeSource
        // }" target="_blank">Code Source</a>`;
        // const liveSite = `<a href="${project.liveSite
        //   }" target="_blank">Live Site</a>`;

        // return `<li><div><div><h2>${
        //   project.title
        // }</h2></div>${project.summary ? `<p>${project.summary}</p>` : ""}${
        //   highlights.length > 0 ? `<ul>${highlights}</ul>` : ""
        // }</div></li>`;
    

    resume.projects.forEach(project => {
        let projectName = project.title
        let projectGithub = `<a href="${project.codeSource}" target="_blank">Code Source</a>`;
        let projectLiveSite = `<a href="${project.liveSite}" target="_blank">Live Site</a>`;
        let highlights = project.highlights.map((highlight) => `<li>${highlight}</li>`).join("");

        let projectMarkup = `<li><div><div><h2>${project.title}</h2></div>${
          project.summary ? `<p>${project.summary}</p>` : ""
        }${highlights.length > 0 ? `<ul>${highlights}</ul>` : ""}</div></li>`;

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