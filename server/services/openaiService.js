// services/openaiService.js
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MODEL = process.env.OPENAI_MODEL || 'gpt-4o';
const SONGS_COUNT = parseInt(process.env.SONGS_COUNT, 10) || 15;
const MAX_TOKENS = parseInt(process.env.OPENAI_MAX_TOKENS, 10) || 300;

// Хелпер: вытаскиваем первый валидный массив из текста
function extractJsonArray(text) {
  try {
    // Самый частый вариант — лишний текст вокруг массива
    const match = text.match(/\[([\s\S]+)\]/);
    if (match) {
      return JSON.parse('[' + match[1] + ']');
    } else {
      // Если просто чистый JSON-массив
      return JSON.parse(text);
    }
  } catch (err) {
    throw new Error('Не удалось извлечь JSON из ответа LLM:\n' + text);
  }
}

async function generateTracks(prompt) {
  const systemPrompt = `Ты музыкальный редактор. Тебе даётся вайб или тема — всегда отвечай ровно списком не менее ${SONGS_COUNT} зарубежных песен в формате JSON-массива:
[
  {"artist": "Исполнитель", "title": "Песня"}
]
Только этот массив — без вступлений, без комментариев, без номеров, без обёрток, только JSON-массив!`;

  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt },
    ],
    max_tokens: MAX_TOKENS,
    temperature: 0.8,
  });

  const text = completion.choices[0].message.content?.trim();
  console.log('Ответ LLM:\n', text);

  const json = extractJsonArray(text);
  return json;
}

module.exports = { generateTracks };
