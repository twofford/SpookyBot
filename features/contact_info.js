/**
This module allows a user to get contact information about the app's creator
**/
const { BotkitConversation } = require('botkit');
const resume = require("../public/assets/resume.json");

module.exports = function (controller) {
  //Generates an array of objects with answers to profile questions
  const allProfiles = resume.basics.profiles.map(profile => {
    return {
      'network': profile.network,
      'listItem': `<li>${profile.network}: <a href = ${profile.url} target = "_blank" >${profile.network}</a></li>`,
      'hyperlink': `<a href = ${profile.url} target = "_blank" >${profile.network}</a>`
    };
  });
  //Generate a bot listener for each contact network profile
  allProfiles.forEach(profile => {
    const query = profile.network.toLowerCase();
    return controller.hears(new RegExp(query, 'i'), ['message'], async (bot, message) => {
      await bot.reply(message, { type: 'typing' });
      setTimeout(async () => {
        // will have to reset context because turn has now ended.
        await bot.changeContext(message.reference);
        await bot.reply(message, `Connect with ${firstName} on ${profile.hyperlink}`);
      }, 1000);
    });
  });
  //Generates quick replies for network profiles
  const profileQuickReplies = allProfiles.map(profile => {
    return { 'title': profile.network, 'payload': profile.network.toLowerCase() };
  });

  //Answers to questions related to basic contact information
  const firstName = resume.basics.name.split(' ')[0];
  const contactAllProfiles = allProfiles.length > 0 ? allProfiles.map(profile => profile.listItem).join('') : null;
  const contactPhone = resume.basics.phone !== '' ? `<a href="tel:+1${resume.basics.phone}">${resume.basics.phone}</a>` : null;
  const contactEmail = resume.basics.email !== '' ? `<a href="mailto:${resume.basics.email}" target="_blank">${resume.basics.email}</a>` : null;
  const contactCity = resume.basics.location.city ? `${resume.basics.location.city}, `: '';
  const contactRegion = resume.basics.location.region ? `${resume.basics.location.region}, ` : '';
  const contactCountry = resume.basics.location.countryCode ? `${resume.basics.location.countryCode}` : '';
  const contactAddress = `${contactCity}${contactRegion}${contactCountry}`;
  const contactSummary = `${resume.basics.summary}`;

  //Bot listeners
  controller.hears('all contact info', ['message'], async (bot, message) => {
    await bot.reply(message, { type: 'typing' });
    setTimeout(async () => {
      // will have to reset context because turn has now ended.
      await bot.changeContext(message.reference);
      await bot.reply(message, `<p>Here are a few places where you can reach ${firstName}:</p><ul>${contactPhone ? `<li>Phone: ${contactPhone}</li>` : ''}<li>Email: ${contactEmail}</li>${contactAllProfiles ? contactAllProfiles : ''}${contactAddress !== '' ? `<li>Location: ${contactAddress} </li>` : ''}</ul><p>Hope you have a spooky good time connecting!</p>`);
    }, 1000);
  });
  controller.hears(new RegExp(/phone|call/i), ['message'], async (bot, message) => {
    await bot.reply(message, { type: 'typing' });
    setTimeout(async () => {
      // will have to reset context because turn has now ended.
      await bot.changeContext(message.reference);
      await bot.reply(message, contactPhone ? `Call or text ${firstName} at ${contactPhone}` : `Sorry ${firstName} does not share their phone number.`);
    }, 1000);
  });
  controller.hears(new RegExp(/email/i), ['message'], async (bot, message) => {
    await bot.reply(message, { type: 'typing' });
    setTimeout(async () => {
      // will have to reset context because turn has now ended.
      await bot.changeContext(message.reference);
      await bot.reply(message, contactEmail ? `Email ${firstName} at ${contactEmail}` : `Sorry ${firstName} does not share their email.`);
    }, 1000);
  });
  controller.hears(new RegExp(/address|live/i), ['message'], async (bot, message) => {
    await bot.reply(message, { type: 'typing' });
    setTimeout(async () => {
      // will have to reset context because turn has now ended.
      await bot.changeContext(message.reference);
      await bot.reply(message, contactAddress ? `${firstName} lives in ${contactAddress}. Trick or Treat!` : `Sorry ${firstName} does not share their address.`);
    }, 1000);
  });
  controller.hears(new RegExp('summary'), ['message'], async (bot, message) => {
    await bot.reply(message, `Certainly! Here\'s what ${firstName} has to say`);
    await bot.reply(message, { type: 'typing' });
    setTimeout(async () => {
      // will have to reset context because turn has now ended.
      await bot.changeContext(message.reference);
      await bot.reply(message, contactSummary);
    }, 1000);
  });
  controller.hears(new RegExp(`about ${firstName}`, 'i'), ['message'], async (bot, message) => {
    await bot.reply(message, `Certainly! Here\'s what ${firstName} has to say`);
    await bot.reply(message, { type: 'typing' });
    setTimeout(async () => {
      // will have to reset context because turn has now ended.
      await bot.changeContext(message.reference);
      await bot.reply(message, contactSummary);
    }, 1000);
  });
  controller.hears(new RegExp(`who is ${firstName}`, 'i'), ['message'], async (bot, message) => {
    await bot.reply(message, `Certainly! Here\'s what ${firstName} has to say`);
    await bot.reply(message, { type: 'typing' });
    setTimeout(async () => {
      // will have to reset context because turn has now ended.
      await bot.changeContext(message.reference);
      await bot.reply(message, contactSummary);
    }, 1000);
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
        title: "Address",
        payload: "address"
      },
    ].concat(profileQuickReplies)
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
    text: `Would you like to contact ${firstName}?`,
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