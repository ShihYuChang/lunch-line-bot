import { config } from "dotenv";
import linebot from "linebot";
import { food } from "./static.js";

config();

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
});

let hasAskCategory = false;
let category = "";

bot.on("message", function (event) {
  const userMessage = event.message.text;
  const foodCategory = Object.keys(food);
  const randomCategory =
    foodCategory[Math.floor(Math.random() * foodCategory.length)];
  if (!hasAskCategory) {
    if (userMessage == "吃什麼") {
      event
        .reply(`吃${randomCategory}好嗎？`)
        .then(() => {
          category = randomCategory;
          hasAskCategory = true;
        })
        .catch((err) => console.log(err));
    } else {
      event.reply("請輸入「吃什麼」");
    }
  } else {
    if (userMessage === "好") {
      const foodChoices = food[category];
      const randomFood =
        foodChoices[Math.floor(Math.random() * foodChoices.length)];
      event
        .reply(`那就吃${randomFood}吧！`)
        .then(() => (hasAskCategory = false))
        .catch((err) => console.log(err));
    } else if (userMessage === "不好") {
      event
        .reply(`吃${randomCategory}好嗎？`)
        .then(() => {
          category = randomCategory;
          hasAskCategory = true;
        })
        .catch((err) => console.log(err));
    } else {
      event.reply("好還不好啦");
    }
  }
});

bot.listen("/linewebhook", 3000, function () {
  console.log("[BOT已準備就緒]");
});
