const { cmd } = require('../command');
const axios = require('axios');
const xml2js = require('xml2js');

cmd({
    pattern: "derananews",
    alias: ["derana", "adanews", "adanerana"],
    desc: "Get latest Ada Derana news headlines",
    category: "news",
    react: "📰",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        reply("Fetching the latest Ada Derana news...");

        const rssUrl = 'https://www.adaderana.lk/rss.php';
        const response = await axios.get(rssUrl);
        const rss = await xml2js.parseStringPromise(response.data, { explicitArray: false });

        const items = rss.rss.channel.item.slice(0, 5); // get top 5 news items
        if (!items || items.length === 0) {
            return reply("No news items found.");
        }

        let newsText = "📰 *Latest Ada Derana News Headlines:*\n\n";
        items.forEach((item, i) => {
            newsText += `*${i + 1}.* ${item.title.trim()}\n🕒 ${item.pubDate.trim()}\n🔗 ${item.link.trim()}\n\n`;
        });

        await conn.sendMessage(from, {
            text: newsText,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in Derana News plugin:", e);
        reply(`An error occurred while fetching news: ${e.message}`);
    }
});
          
