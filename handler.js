'use strict';
class TaskHandler {
  #tasks = [];
  #processed = new Set();

  constructor() {}

  async registerTask(taskId, taskFn) {
    if (typeof taskFn !== 'function') {
      throw new Error('Task must be a function');
    }

    const task = {
      id: taskId,
      fn: taskFn.toString(),
      status: 'registered',
      created: Date.now()
    };

    this.#tasks.push(task);
    return taskId;
  }

  async executeAll() {
    const results = [];
    const currentTasks = [...this.#tasks];  
    this.#tasks = [];

    for (const task of currentTasks) {
      if (this.#processed.has(task.id)) {
        continue;
      }

      try {
        const fn = new Function('return (' + task.fn + ')')();
        const result = await Promise.resolve(fn());
        results.push({ id: task.id, status: 'success', result });
        this.#processed.add(task.id);
      } catch (err) {
        results.push({ id: task.id, status: 'error', error: err.message });
      }
    }

    return results;
  }

  async cleanup() {
    const cleaned = this.#processed.size;
    this.#processed.clear();
    this.#tasks = this.#tasks.filter(task => !this.#processed.has(task.id));
    return cleaned;
  }

  getPendingTasks() {
    return this.#tasks.map(task => task.id);
  }

}

module.exports = TaskHandler;