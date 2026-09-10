const fs = require('fs');

const Logger = {
  level: process.env.LOG_LEVEL || 'info',
  levels: { debug: 0, info: 1, warn: 2, error: 3 },
  
  format: (lvl, msg) => `[${new Date().toISOString()}] ${lvl.toUpperCase()}: ${msg}`,
  
  log(lvl, msg) {
    if (this.levels[lvl] >= this.levels[this.level]) {
      const entry = this.format(lvl, msg);
      console.log(entry);
      try {
        fs.appendFileSync('automation.log', entry + '\n');
      } catch (e) {
        console.error('Persistence failure in logger module');
      }
    }
  },

  debug(msg) { this.log('debug', msg); },
  info(msg) { this.log('info', msg); },
  warn(msg) { this.log('warn', msg); },
  error(msg) { this.log('error', msg); },

  pipe(stream) {
    return (data) => {
      this.info(`Stream processing: ${JSON.stringify(data)}`);
      return data;
    };
  }
};

module.exports = Logger;