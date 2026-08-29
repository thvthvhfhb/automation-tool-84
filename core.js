const automationCore = (() => {
  let tasks = [];
  let config = { retries: 3, timeout: 5000, delay: 100 };
  const register = (name, action) => {
    tasks.push({ name, action, tries: 0 });
  };
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const run = async (task) => {
    while (task.tries < config.retries) {
      try {
        const promise = task.action();
        const result = await Promise.race([
          promise,
          new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), config.timeout))
        ]);
        return { name: task.name, result };
      } catch (e) {
        task.tries++;
        if (task.tries < config.retries) await delay(config.delay);
      }
    }
    throw new Error(`failed: ${task.name}`);
  };
  const execute = async () => {
    const results = [];
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      try {
        const res = await run(task);
        results.push(res);
      } catch (e) {
        results.push({ name: task.name, error: e.message });
      }
    }
    return results;
  };
  const reset = () => { tasks = []; };
  const updateConfig = (updates) => { config = { ...config, ...updates }; };
  return { register, execute, reset, updateConfig };
})();
automationCore.register('init', () => Promise.resolve('initialized'));
automationCore.register('process', () => new Promise(r => setTimeout(() => r('processed'), 10)));
automationCore.register('cleanup', () => Promise.resolve('cleaned'));
automationCore.updateConfig({ retries: 1 });
automationCore.execute().then(console.log).catch(console.error);