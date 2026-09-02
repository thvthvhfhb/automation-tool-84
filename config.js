const defaults = {
  name: "automation-tool-84",
  retryCount: 3,
  debugMode: false,
  enabledModules: ["logger", "core"]
};
/**
 * @typedef {Object} ConfigOptions
 * @property {string} [name]
 * @property {number} [retryCount]
 * @property {boolean} [debugMode]
 * @property {string[]} [enabledModules]
 */
/**
 * @typedef {Object} AutomationConfig
 * @property {string} name
 * @property {number} retryCount
 * @property {boolean} debugMode
 * @property {string[]} enabledModules
 * @property {number} timeout
 */
/**
 * Loads configuration with creative override strategy using reduce
 * @param {ConfigOptions} [options={}] - Configuration options to override defaults
 * @returns {AutomationConfig} Fully configured and frozen object
 */
function loadConfig(options = {}) {
  const validKeys = Object.keys(defaults);
  const config = validKeys.reduce((acc, key) => {
    if (key in options && options[key] !== undefined) {
      let val = options[key];
      if (key === "retryCount") {
        val = Math.max(1, parseInt(val, 10) || defaults[key]);
      } else if (key === "enabledModules") {
        val = Array.isArray(val) ? val.filter(m => typeof m === "string") : defaults[key];
      }
      acc[key] = val;
    } else {
      acc[key] = defaults[key];
    }
    return acc;
  }, {});
  Object.defineProperty(config, "timeout", {
    get: function() {
      return this.retryCount * 500 + 1000;
    },
    enumerable: true
  });
  return Object.freeze(config);
}
/**
 * Checks if a config is properly typed and valid
 * @param {AutomationConfig} config - The config instance to check
 * @returns {boolean} Whether the config passes validation
 */
function isValidConfig(config) {
  if (typeof config !== "object" || config === null) {
    return false;
  }
  const required = ["name", "retryCount", "debugMode", "enabledModules"];
  for (let key of required) {
    if (!(key in config)) return false;
  }
  return typeof config.name === "string" &&
    typeof config.retryCount === "number" && config.retryCount >= 1 &&
    typeof config.debugMode === "boolean" &&
    Array.isArray(config.enabledModules) && config.enabledModules.every(m => typeof m === "string");
}
/**
 * Resets to default configuration creatively by recreating
 * @returns {AutomationConfig} Default config
 */
function resetConfig() {
  return loadConfig({});
}
module.exports = { loadConfig, isValidConfig, resetConfig };