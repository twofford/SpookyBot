/**
This module allows a user to get contact information about the app's creator
**/
const { BotkitConversation } = require('botkit');
const resume = require("../public/assets/resume.json");

module.exports = function (controller) {
  //Answers to questions related to contact information
  const contactPhone = `<a href="tel:+1${resume.basics.phone}">${resume.basics.phone}</a>`;
  const contactEmail = `<a href="mailto:${resume.basics.email}" target="_blank">${resume.basics.email}</a>`;
  const contactLinkedIn = `<a href="${resume.basics.profiles.filter(profile => profile.network === "LinkedIn")[0].url}" target="_blank">LinkedIn</a>`;
  const contactGithub = `<a href="${resume.basics.profiles.filter(profile => profile.network === "Github")[0].url}" target="_blank">Github</a>`;
  const contactAddress = `${resume.basics.location.city}, ${resume.basics.location.region}, ${resume.basics.location.countryCode}`;
  const contactSummary = `${resume.basics.summary}`;

  //Bot listeners
  controller.hears('all contact info', ['message'], async (bot, message) => {
    await bot.reply(message, `<p>Here's a few of the places where you can reach me:</p><ul><li>Phone: ${contactPhone}</li><li>Email: ${contactEmail}</li><li>LinkedIn: ${contactLinkedIn}</li><li>Github: ${contactGithub}</li><li>Location: ${contactAddress}</li></ul><p>Looking forward to connecting!</p>`);
    await bot.cancelAllDialogs();
  });
  controller.hears(new RegExp(/phone|call/i), ['message'], async (bot, message) => {
    await bot.reply(message, `Call or text me at ${contactPhone}`);
  });
  controller.hears(new RegExp(/email/i), ['message'], async (bot, message) => {
    await bot.reply(message, `Email me at ${contactEmail}`);
  });
  controller.hears(new RegExp(/git/i), ['message'], async (bot, message) => {
    await bot.reply(message, `Check out my projects on ${contactGithub}`);
  });
  controller.hears(new RegExp(/linkedin/i), ['message'], async (bot, message) => {
    await bot.reply(message, `Connect with me on ${contactLinkedIn}`);
  });
  controller.hears(new RegExp(/address|live/i), ['message'], async (bot, message) => {
    await bot.reply(message, `I live at ${contactAddress}. Let's get coffee some time!`);
  });
  controller.hears(new RegExp(/summary|about yourself|who are you/i), ['message'], async (bot, message) => {
    await bot.reply(message, contactSummary);
  });

  //Creates an instance of a conversation for dialog tree
  const contactInfo = new BotkitConversation('contactInfo', controller);


  // create a path for when a user says YES
  contactInfo.addMessage({
    text: 'Happy to help! Please select from one of these contact options:',
    quick_replies: [
      {
        title: "All",
        payload: "all contact info",
      },
      {
        title: "Phone",
        payload: "phone",
      },
      {
        title: "Email",
        payload: "email"
      },
      {
        title: "Linkedin",
        payload: "linkedin"
      },
      {
        title: "Github",
        payload: "github"
      },
      {
        title: "Address",
        payload: "address"
      },
    ]
  }, 'yes_thread');

  // create a path for when a user says NO
  contactInfo.addMessage({
    text: 'Oh Okay. No problem. Thanks for visiting the site!',
  }, 'no_thread');

  // create a path where neither option was matched
  // this message has an action field, which directs botkit to go back to the `default` thread after sending this message.
  contactInfo.addMessage({
    text: 'Sorry I did not understand.',
    action: 'default',
  }, 'bad_response');


  contactInfo.ask({
    text: 'Would you like to contact me?',
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
      handler: async function (response, contactInfo, bot) {
        await contactInfo.gotoThread('yes_thread');
      },
    },
    {
      pattern: 'no',
      handler: async function (response, contactInfo, bot) {
        await contactInfo.gotoThread('no_thread');
      },
    },
    {
      default: true,
      handler: async function (response, contactInfo, bot) {
        await contactInfo.gotoThread('bad_response');
      },
    }
  ], 'contactInfo', 'default');

  controller.addDialog(contactInfo);
  controller.hears(new RegExp(/contact/), ['message', 'direct_message'], async (bot, message) => {
    await bot.beginDialog('contactInfo');
  });
};