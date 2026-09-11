const retryNetworkOperation = async (operation, maxRetries = 3, delay = 1000) => {
  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)));
      }
    }
  }

  throw lastError;
};

const withExponentialBackoff = (fn) => {
  return (...args) => retryNetworkOperation(() => fn(...args));
};

const fetchWithRetry = async (url, options = {}, retries = 3) => {
  return await retryNetworkOperation(async () => {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response;
  }, retries);
};

module.exports = { retryNetworkOperation, withExponentialBackoff, fetchWithRetry };