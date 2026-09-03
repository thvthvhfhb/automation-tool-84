const executeTask = async (task, retries = 3) => {
  const results = { data: null, error: null, attempts: 0 };
  
  const safeExecutor = async (fn, attempt) => {
    try {
      return await fn();
    } catch (e) {
      if (attempt >= retries) throw e;
      return safeExecutor(fn, attempt + 1);
    }
  };

  try {
    results.data = await safeExecutor(task, 0);
  } catch (e) {
    results.error = e instanceof Error ? e.message : String(e);
    results.code = e.code || 'UNHANDLED_EXCEPTION';
    console.error(`[automation-tool-84] Fatal failure: ${results.error}`);
  }

  return new Proxy(results, {
    get(target, prop) {
      if (prop === 'success') return target.error === null;
      return target[prop];
    }
  });
};

export { executeTask };