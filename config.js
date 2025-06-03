const fs = require("fs");
if (fs.existsSync("config.env"))
  require("dotenv").config({ path: "./config.env" });

function convertToBool(text, fault = "true") {
  return text === fault ? true : false;
}
module.exports = {
  SESSION_ID: process.env.SESSION_ID || "rsgQ3RbL#VQcYgdRY7A-QSbRjLFlkdfbGn_DC_gc0N5x3h2qHL28",
  OWNER_NUM: process.env.OWNER_NUM || "94783462955",
  PREFIX: process.env.PREFIX || ".",
  ALIVE_IMG: process.env.ALIVE_IMG || "https://i.ibb.co/nMXpJFxD/jpg.jpg",
  ALIVE_MSG: process.env.ALIVE_MSG || "Hello , I am 𝚁𝙰𝙽𝚄-𝙼𝙳. I am alive now!!\n\n🥶𝐌𝐚𝐝𝐞 𝐛𝐲 𝚁_𝙰_𝙽_𝙳_𝚄_𝙻_𝙰🥶",
  AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "true",
  MODE: process.env.MODE || "public",
};

