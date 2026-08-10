class EventHandler {
    constructor() {
        this.handlers = {};
    }

    on(event, handler) {
        if (!this.handlers[event]) {
            this.handlers[event] = [];
        }
        this.handlers[event].push(handler);
    }

    emit(event, ...args) {
        if (this.handlers[event]) {
            // Use forEach for better performance in large arrays
            this.handlers[event].forEach(handler => handler(...args));
        }
    }

    off(event, handler) {
        if (!this.handlers[event]) return;
        this.handlers[event] = this.handlers[event].filter(h => h !== handler);
    }
}

const eventHandler = new EventHandler();

// Example usage
eventHandler.on('dataReceived', (data) => {
    console.log('Data received:', data);
});

// Emit an event
eventHandler.emit('dataReceived', { key: 'value' });

export default eventHandler;