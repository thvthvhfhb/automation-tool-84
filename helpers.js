const fs = require('fs');

const mergeDeep = (target, source) => {
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object && key in target) {
      Object.assign(source[key], mergeDeep(target[key], source[key]));
    }
  }
  Object.assign(target || {}, source);
  return target;
};

const loadConfig = (path, defaults = {}) => {
  let fileData = {};
  try {
    fileData = JSON.parse(fs.readFileSync(path, 'utf8'));
  } catch (e) {
    console.warn(`[automation-tool-84] config missing at ${path}, using defaults`);
  }
  
  const proxyHandler = {
    get: (target, prop) => {
      if (prop in target) return target[prop];
      return defaults[prop];
    }
  };

  return new Proxy(mergeDeep(defaults, fileData), proxyHandler);
};

module.exports = { loadConfig };