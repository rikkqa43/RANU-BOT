const { cmd } = require("../command");
const googleTTS = require("google-tts-api");
const axios = require("axios");

cmd(
  {
    pattern: "tts",
    alias: ["speak", "say"],
    react: "🔊",
    desc: "Convert text to speech",
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
      q,
      isCmd,
      reply,
    }
  ) => {
    try {
      // Ensure that text has been provided
      const text = q;
      if (!text) {
        return reply("Please provide some text for me to speak.\nExample: `.tts Hello there!`");
      }

      // Optionally, limit the length of the text
      if (text.length > 200) {
        return reply("Text is too long. Please limit it to 200 characters.");
      }

      // Generate the TTS audio URL
      const url = googleTTS.getAudioUrl(text, {
        lang: "en",  // Language (you can change it to other language codes)
        slow: false,  // Speed of speech (true = slow, false = normal)
        host: "https://translate.google.com",
      });

      // Download the audio as an arraybuffer (audio data)
      const { data } = await axios.get(url, { responseType: "arraybuffer" });

      // Send the audio as a voice message (PTT) in the chat
      await robin.sendMessage(
        from,
        { audio: data, mimetype: "audio/mpeg", ptt: true },
        { quoted: mek }
      );
    } catch (e) {
      console.error(e);
      reply("An error occurred while generating the TTS audio.");
    }
  }
);
