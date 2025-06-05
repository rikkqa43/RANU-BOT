const config = require('../config');
const { cmd } = require('../command');
const DY_SCRAP = require('@dark-yasiya/scrap');
const dy_scrap = new DY_SCRAP();

function extractYouTubeID(url) {
    const regex = /(?:youtube\.com\/(?:.*v=|.*\/)|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

cmd({
    pattern: "video",
    alias: ["mp4", "ytmp4"],
    react: "🎬",
    desc: "Download Ytmp4",
    category: "download",
    use: ".play4 <Text or YT URL>",
    filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
    try {
        if (!q) return await reply("❌ Please provide a YouTube URL or search text!");

        let id = q.startsWith("https://") ? extractYouTubeID(q) : null;

        if (!id) {
            const search = await dy_scrap.ytsearch(q);
            if (!search?.results?.length) return await reply("❌ No results found!");
            id = search.results[0].videoId;
        }

        const data = await dy_scrap.ytsearch(`https://youtube.com/watch?v=${id}`);
        if (!data?.results?.length) return await reply("❌ Failed to fetch video!");

        const { title, image, timestamp, ago, views, author, url } = data.results[0];

        const info = `🎥 *𝚅𝙸𝙳𝙴𝙾 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝚁* 🎥\n\n` +
            `🎬 *Title:* ${title || "Unknown"}\n` +
            `⏱ *Duration:* ${timestamp || "Unknown"}\n` +
            `👁 *Views:* ${views || "Unknown"}\n` +
            `📅 *Published:* ${ago || "Unknown"}\n` +
            `👤 *Channel:* ${author?.name || "Unknown"}\n` +
            `🔗 *URL:* ${url || "Unknown"}\n\n` +
            `🔽 *Reply with your choice:*\n` +
            `2.1 *Video Type* 🎞\n` +
            `2.2 *Document Type* 📁\n\n` +
            `${config.FOOTER || "𓆩𝚁𝙰𝙽𝚄-MD𓆪"}`;

        const sentMsg = await conn.sendMessage(from, { image: { url: image }, caption: info }, { quoted: mek });
        const messageID = sentMsg.key.id;
        await conn.sendMessage(from, { react: { text: '🎥', key: sentMsg.key } });

        // Listener
        conn.ev.on('messages.upsert', async (messageUpdate) => {
            try {
                const userReplyMsg = messageUpdate?.messages?.[0];
                if (!userReplyMsg?.message) return;

                const userText = userReplyMsg.message?.conversation || userReplyMsg.message?.extendedTextMessage?.text;
                const replyToThis = userReplyMsg.message?.extendedTextMessage?.contextInfo?.stanzaId === messageID;
                if (!replyToThis) return;

                let userReply = userText.trim();
                let msg;
                let response;
                let type;

                if (userReply === "2.1") {
                    msg = await conn.sendMessage(from, { text: "⏳ Fetching Video..." }, { quoted: mek });
                    response = await dy_scrap.ytmp4(`https://youtube.com/watch?v=${id}`);
                    let downloadUrl = response?.result?.download?.url;
                    if (!downloadUrl) return await reply("❌ Download URL not found!");
                    type = { video: { url: downloadUrl }, mimetype: "video/mp4" };

                } else if (userReply === "2.2") {
                    msg = await conn.sendMessage(from, { text: "⏳ Fetching Video as Document..." }, { quoted: mek });
                    response = await dy_scrap.ytmp4(`https://youtube.com/watch?v=${id}`);
                    let downloadUrl = response?.result?.download?.url;
                    if (!downloadUrl) return await reply("❌ Download URL not found!");
                    type = {
                        document: { url: downloadUrl },
                        mimetype: "video/mp4",
                        fileName: `${title?.replace(/[\\/:*?"<>|]/g, '') || "video"}.mp4`,
                        caption: title
                    };

                } else {
                    return await reply("❌ Invalid choice! Reply with 2.1 or 2.2.");
                }

                await conn.sendMessage(from, type, { quoted: mek });
                await conn.sendMessage(from, { text: '✅ Video sent successfully!', edit: msg.key });

            } catch (err) {
                console.error(err);
                await reply(`❌ Error while downloading: ${err.message || "Unknown error"}`);
            }
        });

    } catch (error) {
        console.error(error);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        await reply(`❌ *An error occurred:* ${error.message || "Unknown error"}`);
    }
});
            
