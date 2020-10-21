// Sections to include: 1. Institution 2. Dates attended 3. Degree and Focus 4. Notes

const resume = require("../public/assets/resume.json");
const firstName = resume.basics.name.split(' ')[0]

const { BotkitConversation } = require('botkit');

module.exports = function (controller) {
    const institutions = [];
    const quick_replies_institutions = [];
    
    resume.education.forEach(name => {
        institutions.push(name.institution)
        quick_replies_institutions.push({
            title: `${name.institution}`,
            payload: `${name.institution}`
        })
    });

    console.log(institutions)
    console.log(quick_replies_institutions)
    
    resume.education.forEach(name => {
        console.log(name)
        // let place = new RegExp(name.institution)
        let place = name.institution
        console.log(place)
        let partial = name.institution.split(' ')[0]
        console.log(partial)
        controller.hears(new RegExp(place,"i"), ['message'], async (bot, message) => {
            await bot.reply(message, `${firstName} attended ${name.institution} from 
            ${name.startDate} to ${name.endDate}. They pursued a ${name.studyType} for ${name.area}.`);
        });
        controller.hears(new RegExp(partial,"i"), ['message'], async (bot, message) => {
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