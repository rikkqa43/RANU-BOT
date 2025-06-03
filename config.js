const fs = require("fs");
if (fs.existsSync("config.env"))
  require("dotenv").config({ path: "./config.env" });

function convertToBool(text, fault = "true") {
  return text === fault ? true : false;
}
module.exports = {
  SESSION_ID: process.env.SESSION_ID || "rEsTwArD#MgLanx9dZ7WcxpT5jZr6xpGqekZtGVmTWPTUfDqEsfE",
  OWNER_NUM: process.env.OWNER_NUM || "94783462955",
  PREFIX: process.env.PREFIX || ".",
  ALIVE_IMG: process.env.ALIVE_IMG || "https://i.ibb.co/nMXpJFxD/jpg.jpg",
  ALIVE_MSG: process.env.ALIVE_MSG || "Hello , I am 𝚁𝙰𝙽𝚄-𝙼𝙳. I am alive now!!\n\n🥶𝐌𝐚𝐝𝐞 𝐛𝐲 𝚁_𝙰_𝙽_𝙳_𝚄_𝙻_𝙰🥶",
  AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "true",
  MODE: process.env.MODE || "public",
  AUTO_VOICE: process.env.AUTO_VOICE || "true",
  AUTO_STICKER: process.env.AUTO_STICKER || "true",
  AUTO_REPLY: process.env.AUTO_REPLY || "true",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "AIzaSyACBTtTYTuODdAiJIwVkUYUr5QlvHL_W14",
  MOVIE_API_KEY: process.env.MOVIE_API_KEY || "sky|59fc0195c2954f8123a2b3b0063050299b4b3a62",
};

