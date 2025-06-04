const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const config = require('../config');

const BAISCOPE_API = "https://api.skymansion.site/api/baiscope"; // Replace with real endpoint
const API_KEY = config.MOVIE_API_KEY;

cmd({
    pattern: "baiscope",
    alias: ["bsdl", "bmovie"],
    react: '🎞️',
    category: "download",
    desc: "Search and download Sinhala-subtitled movies from Baiscope",
    filename: __filename
}, async (robin, m, mek, { from, q, reply }) => {
    try {
        if (!q || q.trim() === '') return await reply('❌ Please provide a movie name! (e.g., Fast and Furious)');

        await reply(`🔍 Searching for *${q}* on Baiscope...`);

        // Search query
        const searchUrl = `${BAISCOPE_API}/search?q=${encodeURIComponent(q)}`;
        const response = await fetchJson(searchUrl);

        if (!response || !response.results || !response.results.length) {
            return await reply(`❌ No results found for: *${q}*`);
        }

        const selectedMovie = response.results[0]; // Choose first result
        const downloadInfoUrl = `${BAISCOPE_API}/details?id=${selectedMovie.id}`;
        const movieDetails = await fetchJson(downloadInfoUrl);

        if (!movieDetails || !movieDetails.downloadLink) {
            return await reply('❌ No download link found.');
        }

        const directDownloadLink = movieDetails.downloadLink;

        // Optional: Check file size
        const head = await axios.head(directDownloadLink);
        if (parseInt(head.headers['content-length']) > 100 * 1024 * 1024) {
            return await reply('❌ File is too large to send over WhatsApp.');
        }

        // Download file
        const filePath = path.join(__dirname, `${selectedMovie.title}-baiscope.mp4`);
        const writer = fs.createWriteStream(filePath);

        const { data } = await axios({
            url: directDownloadLink,
            method: 'GET',
            responseType: 'stream'
        });

        data.pipe(writer);

        writer.on('finish', async () => {
            await robin.sendMessage(from, {
                document: fs.readFileSync(filePath),
                mimetype: 'video/mp4',
                fileName: `${selectedMovie.title}-baiscope.mp4`,
                caption: `🎬 *Downloaded from Baiscope*`,
                quoted: mek
            });
            fs.unlinkSync(filePath);
        });

        writer.on('error', async (err) => {
            console.error('Download Error:', err);
            await reply('❌ Failed to download movie. Please try again.');
        });
    } catch (err) {
        console.error('Baiscope command error:', err);
        await reply('❌ Unexpected error occurred. Try again later.');
    }
});
      
