// A simple retry mechanism for network requests
async function retryRequest(fetchFunction, retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            return await fetchFunction();
        } catch (error) {
            if (i < retries - 1) {
                console.warn(`Attempt ${i + 1} failed. Retrying in ${delay}ms...`);
                await new Promise(res => setTimeout(res, delay));
            } else {
                throw new Error(`Request failed after ${retries} attempts: ${error.message}`);
            }
        }
    }
}

// Example usage of retryRequest
async function fetchData() {
    return await retryRequest(async () => {
        const response = await fetch('https://api.example.com/data');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    });
}

export { retryRequest, fetchData };