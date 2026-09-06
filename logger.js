const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, 'logs');
if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR);

const colors = {
  info: '\x1b[36m',
  error: '\x1b[31m',
  warn: '\x1b[33m',
  reset: '\x1b[0m'
};

const Logger = {
  log(level, message) {
    const timestamp = new Date().toISOString();
    const formatted = `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
    console.log(`${colors[level] || ''}${formatted}${colors.reset}`);
    
    const logFile = path.join(LOG_DIR, `${new Date().toLocaleDateString().replace(/\//g, '-')}.log`);
    fs.appendFileSync(logFile, formatted + '\n');
  },
  info(msg) { this.log('info', msg); },
  error(msg) { this.log('error', msg); },
  warn(msg) { this.log('warn', msg); }
};

module.exports = Logger;