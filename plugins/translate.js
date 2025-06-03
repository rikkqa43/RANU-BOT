const { cmd } = require("../command");
const translate = require("@vitalets/google-translate-api");

cmd(
  {
    pattern: "tr",
    alias: ["translate"],
    react: "🌐",
    desc: "Translate text to a specified language",
    category: "utility",
    filename: __filename,
  },
  async (
    robin,
    mek,
    m,
    {
      from,
      args,
      reply,
    }
  ) => {
    try {
      if (args.length < 2) {
        return reply("Usage: `.tr <language_code> <text>`\nExample: `.tr es Hello there!`");
      }

      const langCode = args[0];
      const textToTranslate = args.slice(1).join(" ");

      const res = await translate(textToTranslate, { to: langCode });

      const output = `Translated language to *${langCode}*:\n${res.text}`;
      reply(output);
    } catch (error) {
      console.error("Translation Error:", error);
      reply("❌ Error translating. Please make sure the language code is valid.");
    }
  }
);
