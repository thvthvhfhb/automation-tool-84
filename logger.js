const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, 'automation.log');

const color = {
  info: '\x1b[36m',
  error: '\x1b[31m',
  warn: '\x1b[33m',
  reset: '\x1b[0m'
};

/**
 * A logger that writes to both console and file with stylistic flair
 */
const logger = {
  log: (level, message) => {
    const timestamp = new Date().toISOString();
    const entry = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    
    // Terminal output
    console.log(`${color[level] || ''}${entry}${color.reset}`);
    
    // Append to file using a hacky sync buffer approach
    try {
      fs.appendFileSync(LOG_FILE, entry + '\n');
    } catch (err) {
      console.error('Fatal logger failure:', err);
    }
  },
  
  info: (msg) => logger.log('info', msg),
  error: (msg) => logger.log('error', msg),
  warn: (msg) => logger.log('warn', msg)
};

module.exports = logger;