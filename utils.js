function deepMerge(target, source) {
    if (typeof target !== 'object' || target === null) return source;
    if (Array.isArray(target)) return target.concat(source);

    Object.keys(source).forEach(key => {
        if (source[key] instanceof Object) {
            if (!target[key]) Object.assign(target, { [key]: {} });
            deepMerge(target[key], source[key]);
        } else {
            Object.assign(target, { [key]: source[key] });
        }
    });
    return target;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

function uniqueArray(arr) {
    return [...new Set(arr)];
}

module.exports = { deepMerge, debounce, uniqueArray };