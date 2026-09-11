const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

const batchProcess = (items, processor, batchSize = 100) => {
  const results = [];
  let index = 0;

  const executeBatch = () => {
    const end = Math.min(index + batchSize, items.length);
    for (; index < end; index++) {
      results.push(processor(items[index]));
    }
    if (index < items.length) {
      setTimeout(executeBatch, 0);
    }
  };

  executeBatch();
  return results;
};

const heavyComputation = memoize((data) => {
  let hash = 0;
  const str = JSON.stringify(data);
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
});

module.exports = { memoize, batchProcess, heavyComputation };