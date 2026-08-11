// @ts-check

/**
 * Capitalizes the first letter of a string.
 *
 * @param {string} str - The input string.
 * @returns {string} - The capitalized string.
 */
function capitalizeFirstLetter(str) {
    if (typeof str !== 'string') {
        throw new TypeError('Expected a string');
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generates a random integer between two values.
 *
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 * @returns {number} - A random integer between min and max, inclusive.
 */
function getRandomInt(min, max) {
    if (typeof min !== 'number' || typeof max !== 'number') {
        throw new TypeError('Expected both min and max to be numbers');
    }
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Checks if an array contains a specific value.
 *
 * @param {Array} array - The array to check.
 * @param {*} value - The value to search for.
 * @returns {boolean} - True if the value is found, otherwise false.
 */
function arrayContains(array, value) {
    if (!Array.isArray(array)) {
        throw new TypeError('Expected the first argument to be an array');
    }
    return array.indexOf(value) !== -1;
}

module.exports = { capitalizeFirstLetter, getRandomInt, arrayContains };