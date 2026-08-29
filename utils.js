function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}
function mergeDeep(target, source) {
  const output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = mergeDeep(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}
const dataHandler = {
  create: (initial = {}) => {
    let internalData = JSON.parse(JSON.stringify(initial));
    const api = {
      get: (path) => {
        if (!path) return JSON.parse(JSON.stringify(internalData));
        const keys = path.split('.');
        return keys.reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : undefined), internalData);
      },
      set: (path, value) => {
        const keys = path.split('.');
        let current = internalData;
        for (let i = 0; i < keys.length - 1; i++) {
          if (current[keys[i]] === undefined || typeof current[keys[i]] !== 'object') {
            current[keys[i]] = {};
          }
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        return api;
      },
      merge: (newData) => {
        internalData = mergeDeep(internalData, newData);
        return api;
      },
      process: (fn) => {
        const processRecursive = (obj) => {
          if (Array.isArray(obj)) {
            return obj.map(processRecursive);
          }
          if (isObject(obj)) {
            const newObj = {};
            Object.keys(obj).forEach(k => {
              const recursed = processRecursive(obj[k]);
              newObj[k] = (isObject(recursed) || Array.isArray(recursed)) ? recursed : fn(recursed, k);
            });
            return newObj;
          }
          return fn(obj);
        };
        internalData = processRecursive(internalData);
        return api;
      },
      getData: () => JSON.parse(JSON.stringify(internalData)),
      reset: (newInitial = {}) => {
        internalData = JSON.parse(JSON.stringify(newInitial));
        return api;
      }
    };
    return api;
  }
};
module.exports = dataHandler;