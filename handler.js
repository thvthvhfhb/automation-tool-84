export async function resilientHandler(fn, options = {}) {
  const {
    retries = 3,
    backoffFactor = 2,
    initialDelay = 500,
    jitter = true,
    onRetry = () => {}
  } = options;

  const delaySequence = (function* (start, factor) {
    let current = start;
    while (true) {
      const shift = jitter ? Math.random() * 150 : 0;
      yield current + shift;
      current *= factor;
    }
  })(initialDelay, backoffFactor);

  return async function (...args) {
    let attempt = 0;
    while (true) {
      try {
        return await fn(...args);
      } catch (error) {
        attempt++;
        if (attempt > retries) {
          throw error;
        }
        const delay = delaySequence.next().value;
        onRetry(error, attempt, delay);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  };
}