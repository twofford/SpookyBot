/**
This module allows a user to get contact information about the app's creator
**/
const { formatDate } = require('../utils.js');
const { BotkitConversation } = require('botkit');
const resume = require("../public/assets/resume.json");

module.exports = function (controller) {
  const firstName = resume.basics.name.split(' ')[0];
  //Generates an array of objects with helpful markup for each job
  const allJobs = resume.work.map((job, idx) => {
    const formattedStart = formatDate(`${job.startDate}`, 'en-us', { month: 'short', year: 'numeric' });
    const formattedEnd = job.endDate === '' ? 'Present' : formatDate(`${job.endDate}`, 'en-us', { month: 'short', year: 'numeric' });
    const highlightsMarkup = `<ul>${job.highlights.map(highlight => `<li>${highlight}</li>`).join('')}</ul>`;

    return {
      'id': idx,
      'name': job.name,
      'position': job.position,
      'startDate': job.startDate,
      'endDate': job.endDate,
      'markupLong': `<li><div><div><h2>${job.position}</h2><span>${formattedStart} - ${formattedEnd}<span></div><h3>${job.name}</h3>${job.summary ? `<p>${job.summary}</p>` : ''}${job.highlights.length > 0 ? highlightsMarkup : ''}</div></li>`,
      'markupShort': `<p>${firstName} was a ${job.position} at ${job.name} from ${formattedStart} to ${formattedEnd}.</p>${job.summary ? `<p>${firstName} summarizes the experience as follows:</p><blockquote>${job.summary}</blockquote>` : ''}${job.highlights.length > 0 ? `<p>Here are a few highlights from ${firstName}\'s tenure:</p>${highlightsMarkup}` : ''}`,
      'formattedStart': formattedStart,
      'formattedEnd': formattedEnd,
    };
  });
  //Generate a bot listener for each job company
  allJobs.forEach(job => {
    const position = job.position.toLowerCase();

    return controller.hears(new RegExp(position, 'i'), ['message'], async (bot, message) => {
      await bot.reply(message, job.markupShort);
    });
  });
  //Generates quick replies for each job
  const jobQuickReplies = allJobs.map(job => {
    return { 'title': `${job.position} at ${job.name}`, 'payload': job.position.toLowerCase() };
  });

  //Bot listeners
  controller.hears('all jobs info', ['message'], async (bot, message) => {
    await bot.reply(message, `<ul class="work_history">${allJobs.map(job => job.markupLong).join('')}</ul>`);
  });

  //Creates an instance of a conversation for dialog tree
  const workHistory = new BotkitConversation('workHistory', controller);

  // create a path for when a user says YES
  workHistory.addMessage({
    text: 'Happy to help! Please select from one of these work history options:',
    quick_replies: [
      {
        title: "All",
        payload: "all jobs info",
      },
    ].concat(jobQuickReplies)
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
  controller.hears(new RegExp(/work|job|resume|resumé|employer|employee/i), ['message', 'direct_message'], async (bot, message) => {
    await bot.beginDialog('workHistory');
  });
};