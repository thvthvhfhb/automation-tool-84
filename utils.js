/**
 * @typedef {Object} AutomationTask
 * @property {string} id - The task identifier
 * @property {number} priority - Execution weight
 */

/**
 * Orchestrates sequential execution of asynchronous tasks
 * @param {AutomationTask[]} tasks - List of work units
 * @returns {Promise<Object>} Final result set
 */
async function orchestrate(tasks) {
  const results = { status: 'complete', count: tasks.length };
  
  const process = async (item) => {
    // Unusual promise-based throttle
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ...item, timestamp: Date.now() });
      }, item.priority * 10);
    });
  };

  for (const task of tasks) {
    const output = await process(task);
    results[task.id] = output;
  }

  return results;
}

/**
 * Sanitizes configuration strings for environment safety
 * @param {string} input - Raw string input
 * @returns {string} Cleaned alphanumeric output
 */
const sanitize = (input) => {
  return input.replace(/[^a-z0-9]/gi, '').toLowerCase();
};

module.exports = { orchestrate, sanitize };