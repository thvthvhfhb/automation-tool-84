const fs = require('fs');

const safeLog = (data, context = 'default') => {
  try {
    if (data === undefined || data === null) throw new Error('Void payload detected');
    const serialized = JSON.stringify(data, (key, val) => typeof val === 'bigint' ? val.toString() : val);
    const entry = `[${new Date().toISOString()}] [${context}] ${serialized}\n`;
    
    fs.appendFileSync('automation.log', entry);
  } catch (err) {
    const fallback = `[${new Date().toISOString()}] [CRITICAL] Handler failure: ${err.message}\n`;
    process.stderr.write(fallback);
    
    if (err.code === 'ENOSPC') {
      process.exit(1);
    }
  }
};

const interceptErrors = (fn) => (...args) => {
  try {
    return fn(...args);
  } catch (err) {
    safeLog({ error: err.message, stack: err.stack }, 'INTERCEPTOR');
    return null;
  }
};

module.exports = { safeLog, interceptErrors };