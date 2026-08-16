const fs = require('fs');
const path = require('path');

class Logger {
    constructor(logDir, maxSize, maxFiles) {
        this.logDir = logDir;
        this.maxSize = maxSize;
        this.maxFiles = maxFiles;
        this.currentLogFile = path.join(logDir, `app.log`);
        this.createLogDir();
    }

    createLogDir() {
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
    }

    log(message) {
        const logMessage = `${new Date().toISOString()} - ${message}\n`;
        fs.appendFileSync(this.currentLogFile, logMessage);
        this.rotateLogs();
    }

    rotateLogs() {
        const stats = fs.statSync(this.currentLogFile);
        if (stats.size > this.maxSize) {
            const oldLogFile = `${this.currentLogFile}.${Date.now()}`;
            fs.renameSync(this.currentLogFile, oldLogFile);
            this.cleanOldLogs();
        }
    }

    cleanOldLogs() {
        const files = fs.readdirSync(this.logDir);
        const logFiles = files.filter(file => file.endsWith('.log'));
        if (logFiles.length > this.maxFiles) {
            logFiles.sort();
            const filesToDelete = logFiles.slice(0, logFiles.length - this.maxFiles);
            filesToDelete.forEach(file => fs.unlinkSync(path.join(this.logDir, file)));
        }
    }
}

module.exports = Logger;