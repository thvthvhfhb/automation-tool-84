class ResilienceHandler {
  constructor() {
    this.strategies = new Map([
      ['SyntaxError', (err, input) => {
        if (typeof input !== 'string') return {};
        try {
          return (new Function("return (" + input + ")"))();
        } catch {
          return {};
        }
      }],
      ['TypeError', () => {
        return new Proxy({}, {
          get: (target, prop) => typeof prop === 'string' && prop.startsWith('to') ? () => '' : undefined
        });
      }],
      ['URIError', () => '']
    ]);
  }

  run(fn, contextInput) {
    try {
      return fn(contextInput);
    } catch (error) {
      const healer = this.strategies.get(error.name);
      if (healer) {
        return healer(error, contextInput);
      }
      return { failure: true, message: error.message };
    }
  }

  wrap(target) {
    return new Proxy(target, {
      get: (obj, prop) => {
        if (typeof obj[prop] === 'function') {
          return (...args) => this.run(obj[prop].bind(obj), args[0]);
        }
        return obj[prop];
      }
    });
  }
}

module.exports = { ResilienceHandler };