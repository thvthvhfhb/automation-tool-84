function retry(fn, retries = 3, delay = 1000) {
    return new Promise((resolve, reject) => {
        const attempt = (n) => {
            fn()
                .then(resolve)
                .catch((error) => {
                    if (n === 1) {
                        reject(error);
                        return;
                    }
                    setTimeout(() => attempt(n - 1), delay);
                });
        };
        attempt(retries);
    });
}

async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
}

// Usage example
retry(() => fetchData('https://api.example.com/data'))
    .then(data => console.log(data))
    .catch(error => console.error('Fetch failed after retries:', error));