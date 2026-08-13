const axios = require('axios');

const RETRY_LIMIT = 3;
const RETRY_DELAY = 1000;

const retryRequest = async (url, options = {}, attempt = 1) => {
    try {
        const response = await axios(url, options);
        return response.data;
    } catch (error) {
        if (attempt <= RETRY_LIMIT) {
            console.warn(`Retrying request to ${url}, attempt ${attempt}`);
            await new Promise(res => setTimeout(res, RETRY_DELAY));
            return retryRequest(url, options, attempt + 1);
        } else {
            throw new Error(`Failed to fetch ${url} after ${attempt} attempts: ${error.message}`);
        }
    }
};

module.exports = { retryRequest };