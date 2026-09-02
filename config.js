const loadConfig = (userConfig = {}) => {
  const defaults = {
    maxRetries: 5,
    timeout: 10000,
    verbose: false,
    paths: {
      input: './input',
      output: './output'
    },
    rules: ['validate', 'transform']
  };
  const mergeObjects = (defaultObj, userObj) => {
    const result = {};
    const allKeys = [...new Set(Object.keys(defaultObj || {}).concat(Object.keys(userObj || {})))];
    allKeys.forEach((key) => {
      const defaultValue = defaultObj ? defaultObj[key] : undefined;
      const userValue = userObj ? userObj[key] : undefined;
      if (userValue !== undefined) {
        if (defaultValue && typeof defaultValue === 'object' && defaultValue.constructor === Object &&
            userValue && typeof userValue === 'object' && userValue.constructor === Object) {
          result[key] = mergeObjects(defaultValue, userValue);
        } else {
          result[key] = userValue;
        }
      } else if (defaultValue !== undefined) {
        result[key] = defaultValue;
      }
    });
    return result;
  };
  const mergedConfig = mergeObjects(defaults, userConfig);
  const config = new Proxy(mergedConfig, {
    get(target, prop) {
      return target[prop];
    },
    set(target, prop, value) {
      return false;
    }
  });
  return config;
};
module.exports = loadConfig;