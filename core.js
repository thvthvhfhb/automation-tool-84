const defaultConfig = {
  timeout: 30000,
  retries: 3,
  parallel: false,
  outputFormat: 'csv',
  threshold: 0.5
};

const loadConfig = (userConfig = {}) => {
  const keys = [...new Set(Object.keys(defaultConfig).concat(Object.keys(userConfig)))];
  return keys.reduce((acc, key) => {
    const defaultVal = defaultConfig[key];
    const userVal = userConfig[key];
    if (userVal !== undefined) {
      acc[key] = userVal;
    } else {
      acc[key] = defaultVal;
    }
    return acc;
  }, {});
};

class Config {
  constructor(overrides = {}) {
    this.data = loadConfig(overrides);
  }
  get(key) {
    return this.data[key];
  }
  getAll() {
    return {...this.data};
  }
}

const userSettings = {
  timeout: 10000,
  parallel: true,
  threshold: 0.8
};

const myConfig = new Config(userSettings);
console.log(myConfig.get('timeout'));
console.log(myConfig.getAll());