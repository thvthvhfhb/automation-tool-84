const memoize = (fn, ttl = 3600000) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    const now = Date.now();
    if (cache.has(key)) {
      const { val, expiry } = cache.get(key);
      if (expiry > now) return val;
    }
    const result = fn(...args);
    cache.set(key, { val: result, expiry: now + ttl });
    return result;
  };
};

const batchedProcess = (items, processor, batchSize = 10) => {
  let index = 0;
  const results = [];
  const next = async () => {
    if (index >= items.length) return results;
    const chunk = items.slice(index, index + batchSize);
    index += batchSize;
    const batchResults = await Promise.all(chunk.map(processor));
    results.push(...batchResults);
    return next();
  };
  return next();
};

const debounceRaf = (fn) => {
  let frame = null;
  return (...args) => {
    if (frame) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => fn(...args));
  };
};

module.exports = { memoize, batchedProcess, debounceRaf };