// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { generateTracks } = require('./services/openaiService');
const { searchYoutube } = require('./services/youtubeSearch');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/api/playlist', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'No prompt provided' });

    // 1. Генерируем массив треков
    const tracks = await generateTracks(prompt);

    // 2. Для каждого трека ищем YouTube-видео
    const ytResults = await Promise.all(
      tracks.map(track => {
        const query = `${track.artist} ${track.title}`;
        return searchYoutube(query).catch(err => {
          console.error(`Ошибка поиска YouTube для ${query}:`, err);
          return null;
        });
      })
    );

    // 3. Собираем финальный плейлист
    const playlist = tracks.map((track, i) => ({
      artist: track.artist,
      title: track.title,
      videoId: ytResults[i]?.videoId,
      thumbnail: ytResults[i]?.thumbnail,
    })).filter(item => item.videoId && item.thumbnail);

    res.json({ playlist });
  } catch (err) {
    console.error('Playlist error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
