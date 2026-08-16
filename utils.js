function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function retryOperation(operation, retries = 3, delay = 1000) {
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            return await operation();
        } catch (error) {
            if (attempt < retries - 1) {
                console.warn(`Attempt ${attempt + 1} failed: ${error.message}. Retrying in ${delay}ms...`);
                await sleep(delay);
            } else {
                console.error(`Operation failed after ${retries} attempts: ${error.message}`);
                throw error;
            }
        }
    }
}

module.exports = { retryOperation };