const MAX_RETRIES = 5;
const RETRY_DELAY = 1000;

async function fetchWithRetry(url, options = {}, retries = MAX_RETRIES) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        if (retries > 0) {
            console.warn(`Attempt failed: ${error.message}. Retrying... (${MAX_RETRIES - retries + 1})`);
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            return fetchWithRetry(url, options, retries - 1);
        } else {
            console.error(`Max retries reached. Last error: ${error.message}`);
            throw error;
        }
    }
}

export { fetchWithRetry };