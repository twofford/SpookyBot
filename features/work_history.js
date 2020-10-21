/**
This module allows a user to get contact information about the app's creator
**/
const { formatDate } = require('../utils.js');
const { BotkitConversation } = require('botkit');
const resume = require("../public/assets/resume.json");

module.exports = function (controller) {
  //Reusable work history variables
  const firstName = resume.basics.name.split(' ')[0];
  const work = resume.work;
  const workMarkup = work.map(job => {
    const formattedStart = formatDate(`${job.startDate}`, 'en-us', { month: 'short', year: 'numeric' });
    const formattedEnd = job.endDate === '' ? 'Present' : formatDate(`${job.endDate}`, 'en-us', { month: 'short', year: 'numeric' });
    const highlights = job.highlights.map(highlight => `<li>${highlight}</li>`).join('');
    
    return `<li><div><div><h2>${job.position}</h2><span>${formattedStart} - ${formattedEnd}<span></div><h3>${job.name}</h3>${job.summary ? `<p>${job.summary}</p>` : ''}${highlights.length > 0 ? `<ul>${highlights}</ul>` : '' }</div></li>`;
  }).join('');

  //Bot listeners
  controller.hears('all jobs info', ['message'], async (bot, message) => {
    await bot.reply(message, `<ul class="work_history">${workMarkup}</ul>`);
  });

  //Creates an instance of a conversation for dialog tree
  const workHistory = new BotkitConversation('workHistory', controller);

  // create a path for when a user says YES
  workHistory.addMessage({
    text: `<ul class="work_history">${workMarkup}</ul>`
  }, 'yes_thread');

  // create a path for when a user says NO
  workHistory.addMessage({
    text: 'Oh Okay. No problem. Thanks for visiting the site!',
  }, 'no_thread');

  // create a path where neither option was matched
  // this message has an action field, which directs botkit to go back to the `default` thread after sending this message.
  workHistory.addMessage({
    text: 'Sorry I did not understand.',
    action: 'default',
  }, 'bad_response');

  workHistory.ask({
    text: `Would you like to learn more about ${firstName}'s work history?`,
    quick_replies: [
      {
        title: "Yes",
        payload: 'yes',
      },
      {
        title: "No",
        payload: 'no',
      }
    ]
  }, [
    {
      pattern: 'yes',
      handler: async function (response, workHistory, bot) {
        await workHistory.gotoThread('yes_thread');
      },
    },
    {
      pattern: 'no',
      handler: async function (response, workHistory, bot) {
        await workHistory.gotoThread('no_thread');
      },
    },
    {
      default: true,
      handler: async function (response, workHistory, bot) {
        await workHistory.gotoThread('bad_response');
      },
    }
  ], 'workHistory', 'default');

  controller.addDialog(workHistory);
  controller.hears(new RegExp(/work|job/i), ['message', 'direct_message'], async (bot, message) => {
    await bot.beginDialog('workHistory');
  });
};