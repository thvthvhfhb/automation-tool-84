const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (!cache.has(key)) cache.set(key, fn(...args));
    return cache.get(key);
  };
};

const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const attempt = async (fn, retries = 3) => {
  try {
    return await fn();
  } catch (err) {
    if (retries > 0) {
      await delay(500);
      return attempt(fn, retries - 1);
    }
    throw err;
  }
};

const deepFreeze = (obj) => {
  Object.freeze(obj);
  Object.getOwnPropertyNames(obj).forEach((prop) => {
    if (obj[prop] !== null && (typeof obj[prop] === 'object' || typeof obj[prop] === 'function') && !Object.isFrozen(obj[prop])) {
      deepFreeze(obj[prop]);
    }
  });
  return obj;
};

const pick = (obj, keys) => keys.reduce((acc, k) => (k in obj ? { ...acc, [k]: obj[k] } : acc), {});

module.exports = { memoize, pipe, delay, attempt, deepFreeze, pick };