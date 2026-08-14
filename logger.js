class Logger {
    constructor() {
        this.logs = [];
    }

    log(message) {
        const timestamp = new Date().toISOString();
        this.logs.push(`[${timestamp}] ${message}`);
        console.log(this.logs[this.logs.length - 1]);
    }

    error(message) {
        this.log(`ERROR: ${message}`);
    }

    warn(message) {
        this.log(`WARNING: ${message}`);
    }

    getLogs() {
        return this.logs;
    }
}

const logger = new Logger();

// Example usage
logger.log('Application started');
logger.warn('This is a warning message');
logger.error('This is an error message');

export default logger;