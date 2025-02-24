// server.js
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const ffmpeg = require('fluent-ffmpeg');
const app = express();

app.use(cors());
app.use(express.json());

// Replace with your RapidAPI key
const RAPIDAPI_KEY = 'your-api-key-here';

app.post('/api/download', async (req, res) => {
    try {
        const response = await fetch('https://instagram-downloader-download-instagram-videos-stories.p.rapidapi.com/index', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'instagram-downloader-download-instagram-videos-stories.p.rapidapi.com'
            },
            body: JSON.stringify({ url: req.body.url })
        });

        const data = await response.json();
        res.json({ videoUrl: data.media });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/convert-mp3', async (req, res) => {
    try {
        const videoUrl = req.query.videoUrl;
        
        // Set response headers for MP3
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Disposition', 'attachment; filename="reel.mp3"');

        // Convert and stream
        ffmpeg(videoUrl)
            .format('mp3')
            .audioBitrate(128)
            .pipe(res, { end: true });
            
    } catch (error) {
        res.status(500).send(error.message);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
