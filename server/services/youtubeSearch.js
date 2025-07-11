const { exec } = require('child_process');
const path = require('path');

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function cleanQuery(query) {
  return query.replace(/^\d+\.\s*/, '').trim();
}

async function searchYoutube(query, retries = 3) {
  const clean = cleanQuery(query);

  // Получаем абсолютный путь к yt-dlp.exe в этой же папке
  const ytDlpPath = path.join(__dirname, 'yt-dlp.exe');

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await new Promise((resolve) => {
        exec(
          `"${ytDlpPath}" "ytsearch1:${clean}" --print "%(id)s|%(thumbnail)s" --no-warnings --skip-download`,
          { timeout: 15000 },
          (error, stdout, stderr) => {
            console.log('YT-DLP CALLBACK', { error, stdout, stderr });

            if (stdout) {
              const [videoId, thumbnail] = stdout.trim().split('|');
              if (videoId && thumbnail) {
                return resolve({ videoId, thumbnail });
              }
            }

            if (error) {
              if (error.killed) {
                console.error(`yt-dlp timeout для: ${clean}`);
              } else {
                console.error(`yt-dlp error для: ${clean}`, error, stderr);
              }
            } else {
              console.error(`yt-dlp: видео не найдено для: ${clean}`, { stdout });
            }
            resolve(null);
          }
        );
      });

      if (result) return result;

      if (attempt < retries) {
        console.log(`Повторная попытка yt-dlp для "${clean}" (попытка ${attempt + 1})...`);
        await delay(1000);
      }
    } catch (e) {
      console.error(`Ошибка при вызове yt-dlp для "${clean}":`, e);
      if (attempt < retries) await delay(1000);
    }
  }

  return null;
}

module.exports = { searchYoutube };
