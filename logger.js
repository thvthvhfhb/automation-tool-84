const fs = require('fs');
const path = require('path');

const LOG_DIR = './logs';
const MAX_SIZE = 1024 * 1024 * 5;

if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR);

const logger = (message) => {
  const logFile = path.join(LOG_DIR, 'app.log');
  const timestamp = new Date().toISOString();
  const entry = `[${timestamp}] ${message}\n`;

  try {
    const stats = fs.existsSync(logFile) ? fs.statSync(logFile) : { size: 0 };
    if (stats.size > MAX_SIZE) {
      const archive = path.join(LOG_DIR, `app-${Date.now()}.log`);
      fs.renameSync(logFile, archive);
    }
    fs.appendFileSync(logFile, entry);
  } catch (err) {
    process.stderr.write(`Logger failure: ${err.message}\n`);
  }
};

module.exports = logger;