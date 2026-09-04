const env = process.env.NODE_ENV || 'development';

const configurations = {
  development: {
    db: 'mongodb://localhost:27017/dev',
    logLevel: 'debug',
    retryLimit: 3
  },
  production: {
    db: process.env.DB_URL,
    logLevel: 'warn',
    retryLimit: 10
  }
};

const mergeConfig = (base, override) => {
  const target = { ...base };
  Object.keys(override).forEach(key => {
    target[key] = override[key] ?? target[key];
  });
  return Object.freeze(target);
};

const activeConfig = mergeConfig(
  configurations[env],
  { updatedAt: new Date().toISOString() }
);

export default activeConfig;

export const validate = (cfg) => {
  if (!cfg.db) throw new Error('Missing database connection string');
  return true;
};

const setupWatcher = (cfg) => {
  console.log(`Configuration initialized for: ${env}`);
  return () => console.log('Cleanup complete');
};

setupWatcher(activeConfig);