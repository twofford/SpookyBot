/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

/**
* This module demonstrates the use of the typing indicator in a conversation, and when using bot.reply
* Tell your bot "typing dialog" or "typing reply" to see this in action.
*/
const { BotkitConversation } = require('botkit');
const resume = require("../public/assets/resume.json");

module.exports = function (controller) {
  controller.hears('all contact info', ['message'], async (bot, message) => {
    await bot.reply(message, `Call me at ${resume.basics.phone}`);
    await bot.reply(message, `Email me at ${resume.basics.email}`);
    await bot.reply(message, `I live in ${resume.basics.location.city}, ${resume.basics.location.region}, ${resume.basics.location.countryCode}. Let's get coffee sometime!`);
  });
  controller.hears(new RegExp(/phone|call/i), ['message'], async (bot, message) => {
    await bot.reply(message, `Call me at ${resume.basics.phone}`);
  });
  controller.hears(new RegExp(/email/i), ['message'], async (bot, message) => {
    await bot.reply(message, `Email me at ${resume.basics.email}`);
  });
  controller.hears(new RegExp(/address|live/i), ['message'], async (bot, message) => {
    await bot.reply(message, `I live in ${resume.basics.location.city}, ${resume.basics.location.region}, ${resume.basics.location.countryCode}. Let's get coffee sometime!`);
  });
  controller.hears(new RegExp(/summary|^tell me about yourself$/i), ['message'], async (bot, message) => {
    await bot.reply(message, `${resume.basics.summary}`);
  });

  const contactInfo = new BotkitConversation('contactInfo', controller);

  // create a path for when a user says YES
  contactInfo.addMessage({
    text: 'Great! Select from one of these options:',
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
        title: "Address",
        payload: "address",
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
    bot.beginDialog('contactInfo');
  });
};