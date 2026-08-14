// @type {Object<string, string>}
const settings = {
    API_URL: 'https://api.example.com',
    TIMEOUT: '5000',
    RETRY_ATTEMPTS: '3'
};

/**
 * Gets the configuration settings.
 *
 * @returns {Object<string, string>} The current settings.
 */
function getConfig() {
    return settings;
}

/**
 * Updates a specific setting.
 *
 * @param {string} key - The setting key to update.
 * @param {string} value - The new value for the setting.
 * @returns {boolean} True if updated successfully, false otherwise.
 */
function updateSetting(key, value) {
    if(settings.hasOwnProperty(key)) {
        settings[key] = value;
        return true;
    }
    return false;
}

module.exports = { getConfig, updateSetting };