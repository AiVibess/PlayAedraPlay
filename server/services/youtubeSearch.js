const { exec } = require('child_process');
const path = require('path');

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function searchYoutube(query, retries = 3) {
  const clean = query.trim();
  const ytDlpPath = path.join(__dirname, 'yt-dlp.exe'); // на уровень выше из services

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const command = `"${ytDlpPath}" "ytsearch1:${clean}" --print "%(id)s|%(thumbnail)s" --skip-download --no-warnings --no-playlist`;
      const result = await new Promise((resolve) => {
        exec(
          command,
          { timeout: 15000 },
          (error, stdout, stderr) => {
            if (stdout) {
              const [videoId, thumbnail] = stdout.trim().split('|');
              if (videoId && thumbnail) {
                return resolve({ videoId, thumbnail });
              }
            }
            resolve(null);
          }
        );
      });

      if (result) return result;
      if (attempt < retries) await delay(1000);
    } catch (e) {
      if (attempt < retries) await delay(1000);
    }
  }
  return null;
}

module.exports = { searchYoutube };
