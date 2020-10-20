/**
This module allows a user to get contact information about the app's creator
**/
const { formatDate } = require('../utils.js');
const { BotkitConversation } = require('botkit');
const resume = require("../public/assets/resume.json");

module.exports = function (controller) {
  //Answers to questions related to contact information
  const workHistory = resume.work; 
  //Bot listeners
  controller.hears('all jobs info', ['message'], async (bot, message) => {
    const workMarkup = workHistory.map(job => {
      const formattedStart = formatDate(`${job.startDate}`, 'en-us', { month: 'short', year: 'numeric' });
      const formattedEnd = job.endDate === '' ? 'Present' : formatDate(`${job.endDate}`, 'en-us', { month: 'short', year: 'numeric' });
      const highlights = job.highlights.map(highlight => `<li>${highlight}</li>`).join('');

      return `<h3>${job.name}</h3><h4>${job.position} | ${formattedStart} - ${formattedEnd}</h4><p>${job.summary}</p><div>${highlights}</div>`;
    }).join('');
    await bot.reply(message, workMarkup);
  });

  //Creates an instance of a conversation for dialog tree
  // const contactInfo = new BotkitConversation('contactInfo', controller);


  // // create a path for when a user says YES
  // contactInfo.addMessage({
  //   text: 'Happy to help! Please select from one of these contact options:',
  //   quick_replies: [
  //     {
  //       title: "All",
  //       payload: "all contact info",
  //     },
  //     {
  //       title: "Phone",
  //       payload: "phone",
  //     },
  //     {
  //       title: "Email",
  //       payload: "email"
  //     },
  //     {
  //       title: "Linkedin",
  //       payload: "linkedin"
  //     },
  //     {
  //       title: "Github",
  //       payload: "github"
  //     },
  //     {
  //       title: "Address",
  //       payload: "address"
  //     },
  //   ]
  // }, 'yes_thread');

  // // create a path for when a user says NO
  // contactInfo.addMessage({
  //   text: 'Oh Okay. No problem. Thanks for visiting the site!',
  // }, 'no_thread');

  // // create a path where neither option was matched
  // // this message has an action field, which directs botkit to go back to the `default` thread after sending this message.
  // contactInfo.addMessage({
  //   text: 'Sorry I did not understand.',
  //   action: 'default',
  // }, 'bad_response');


  // contactInfo.ask({
  //   text: 'Would you like to contact me?',
  //   quick_replies: [
  //     {
  //       title: "Yes",
  //       payload: 'yes',
  //     },
  //     {
  //       title: "No",
  //       payload: 'no',
  //     }
  //   ]
  // }, [
  //   {
  //     pattern: 'yes',
  //     handler: async function (response, contactInfo, bot) {
  //       await contactInfo.gotoThread('yes_thread');
  //     },
  //   },
  //   {
  //     pattern: 'no',
  //     handler: async function (response, contactInfo, bot) {
  //       await contactInfo.gotoThread('no_thread');
  //     },
  //   },
  //   {
  //     default: true,
  //     handler: async function (response, contactInfo, bot) {
  //       await contactInfo.gotoThread('bad_response');
  //     },
  //   }
  // ], 'contactInfo', 'default');

  // controller.addDialog(contactInfo);
  // controller.hears(new RegExp(/contact/), ['message', 'direct_message'], async (bot, message) => {
  //   await bot.beginDialog('contactInfo');
  // });
};