const normalize = (data, strategy = 'deep') => {
  const mapper = {
    deep: (val) => val && typeof val === 'object' 
      ? Object.fromEntries(Object.entries(val).map(([k, v]) => [k.toLowerCase(), normalize(v)])) 
      : val,
    flat: (val) => (typeof val === 'string' ? val.trim() : val)
  };
  return Array.isArray(data) ? data.map(mapper[strategy]) : mapper[strategy](data);
};

const deepFreeze = (obj) => {
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object' && obj[key] !== null) deepFreeze(obj[key]);
  });
  return Object.freeze(obj);
};

const getNested = (obj, path, fallback = null) => {
  return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : fallback), obj);
};

const debounce = (fn, ms) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
};

module.exports = { normalize, deepFreeze, getNested, debounce };