/**
 * Defensive execution harness with automatic parameter recovery for edge cases
 */
const bubbleWrap = (fn, fallbackValue = null) => {
  const remedies = [
    (args) => args.map(arg => typeof arg === 'string' && !isNaN(arg) && arg.trim() !== '' ? Number(arg) : arg),
    (args) => args.map(arg => arg === undefined || arg === null ? {} : arg),
    (args) => args.map(arg => typeof arg === 'object' && arg !== null ? Object.freeze({ ...arg }) : arg)
  ];

  return (...args) => {
    try {
      return fn(...args);
    } catch (initialError) {
      for (const remedy of remedies) {
        try {
          const healedArgs = remedy(args);
          if (JSON.stringify(healedArgs) !== JSON.stringify(args)) {
            return fn(...healedArgs);
          }
        } catch {
          // Ignore unsuccessful recovery mutations and try next
        }
      }

      if (initialError instanceof TypeError && typeof fallbackValue === 'function') {
        return fallbackValue(initialError, ...args);
      }

      if (fallbackValue !== null) {
        return fallbackValue;
      }

      throw new Error(`Execution permanently halted: ${initialError.message}`, { cause: initialError });
    }
  };
};

const safeParseJSON = bubbleWrap((str) => JSON.parse(str), {});

const safeSum = bubbleWrap((a, b) => {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Math requires real numbers');
  }
  return a + b;
}, 0);

module.exports = { bubbleWrap, safeParseJSON, safeSum };