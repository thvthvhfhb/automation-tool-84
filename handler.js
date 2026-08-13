const axios = require('axios');

async function fetchWithRetry(url, options = {}, retries = 3, delay = 1000) {
    try {
        const response = await axios(url, options);
        return response.data;
    } catch (error) {
        if (retries > 0) {
            console.warn(`Retrying... (${retries} attempts left)`);
            await new Promise(res => setTimeout(res, delay));
            return fetchWithRetry(url, options, retries - 1, delay);
        }
        throw new Error(`Request failed after ${3 - retries + 1} attempts: ${error.message}`);
    }
}

module.exports = { fetchWithRetry };