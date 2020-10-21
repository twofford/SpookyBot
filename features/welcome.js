const resume = require("../public/assets/resume.json");
const { BotkitConversation } = require("botkit");

module.exports = function (controller) {
  const newUserDialog = new BotkitConversation("new_welcome", controller);
  const returnUserDialog = new BotkitConversation("return_welcome", controller);

  newUserDialog.addMessage({
    text: `💀: Hello there, I'm SpookyBot! I exist to tell you about ${resume.basics.name}. ${resume.basics.name} is in the job market! I see that this is your first time here. I know the following stuff about ${resume.basics.name}:`,
    quick_replies: [
      {
        title: "Contact",
        payload: "contact",
      },
      {
        title: "Education",
        payload: "education",
      },
      {
        title: "Work",
        payload: "work",
      },
      {
        title: "Skills",
        payload: "skills",
      },
    ],
  });

  controller.addDialog(newUserDialog);

  returnUserDialog.say({
    text: `💀: Welcome back! As you know, I'm SpookyBot. I exist to tell you about ${resume.basics.name}. ${resume.basics.name} is in the job market! I know the following stuff about ${resume.basics.name}:`,
    quick_replies: [
      {
        title: "Contact",
        payload: "contact",
      },
      {
        title: "Education",
        payload: "education",
      },
      {
        title: "Work",
        payload: "work",
      },
      {
        title: "Skills",
        payload: "skills",
      },
    ],
  });

  controller.addDialog(returnUserDialog);

  controller.on("hello", async(bot) => {
      await bot.beginDialog("new_welcome")
  })

  controller.on("welcome_back", async(bot) => {
      await bot.beginDialog("return_welcome")
  })

};
