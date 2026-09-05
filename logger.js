const FALLBACK_BUFFER = Symbol('fallback_buffer');

class EdgeCaseLogger {
  #buffer = [];
  #maxSize = 50;

  constructor(options = {}) {
    this.#maxSize = options.maxSize || 50;
    this[FALLBACK_BUFFER] = [];
  }

  #sanitize(val, seen = new WeakSet()) {
    if (val === null || val === undefined) return String(val);
    if (typeof val === 'bigint') return `${val.toString()}n`;
    if (typeof val === 'symbol') return val.toString();
    if (typeof val === 'function') return `[Function: ${val.name || 'anonymous'}]`;
    if (val instanceof Error) {
      return {
        name: val.name || 'Error',
        message: val.message || 'Unknown error message',
        stack: val.stack || 'No stack trace available'
      };
    }
    if (typeof val === 'object') {
      if (seen.has(val)) return '[Circular Reference]';
      seen.add(val);
      const cleanObj = Array.isArray(val) ? [] : {};
      for (const key of Reflect.ownKeys(val)) {
        try {
          cleanObj[String(key)] = this.#sanitize(val[key], seen);
        } catch (err) {
          cleanObj[String(key)] = `[Unreadable Property: ${err.message}]`;
        }
      }
      return cleanObj;
    }
    return val;
  }

  log(level = 'info', ...args) {
    try {
      const entry = {
        timestamp: new Date().toISOString(),
        level: String(level).toUpperCase(),
        payload: args.map(arg => this.#sanitize(arg))
      };
      this.#buffer.push(entry);
      if (this.#buffer.length > this.#maxSize) this.#buffer.shift();
      return entry;
    } catch (fatalErr) {
      const recovery = {
        timestamp: new Date().toISOString(),
        error: fatalErr?.message || 'Fatal logger degradation'
      };
      this[FALLBACK_BUFFER].push(recovery);
      return null;
    }
  }

  getHistory() {
    return [...this.#buffer];
  }
}

module.exports = { EdgeCaseLogger };