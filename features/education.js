// Sections to include: 1. Institution 2. Dates attended 3. Degree and Focus 4. Notes

const resume = require("../public/assets/resume.json");

const { BotkitConversation } = require('botkit');

module.exports = function (controller) {
    const institutions = []
    
    resume.education.forEach(name => {
        institutions.push(name.institution)    
    });

    console.log(institutions)

    resume.education.forEach(name => {
        console.log(name)
        let place = new RegExp(name.institution)
        console.log(place)
        let partial = new RegExp(name.institution.split(' ')[0])
        console.log(partial)
        controller.hears(new RegExp(place,"i"), ['message'], async (bot, message) => {
            await bot.reply(message, `I attended ${name.institution} from ${name.startDate} to ${name.endDate}. I pursued a ${name.studyType} for ${name.area}.`);
        });
    });

};