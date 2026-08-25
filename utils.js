const utils = {
  deepClone: function(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    const root = Array.isArray(obj) ? [] : {};
    const stack = [{src: obj, dest: root}];
    while (stack.length > 0) {
      const {src, dest} = stack.pop();
      for (const key in src) {
        if (Object.prototype.hasOwnProperty.call(src, key)) {
          const val = src[key];
          if (val !== null && typeof val === 'object') {
            const newDest = Array.isArray(val) ? [] : {};
            dest[key] = newDest;
            stack.push({src: val, dest: newDest});
          } else {
            dest[key] = val;
          }
        }
      }
    }
    return root;
  },
  mergeData: function(target, ...sources) {
    let result = this.deepClone(target || {});
    sources.forEach(source => {
      if (!source || typeof source !== 'object') return;
      const clonedSource = this.deepClone(source);
      for (const key in clonedSource) {
        if (Object.prototype.hasOwnProperty.call(clonedSource, key)) {
          const val = clonedSource[key];
          if (result[key] !== null && typeof result[key] === 'object' && !Array.isArray(result[key]) && val !== null && typeof val === 'object' && !Array.isArray(val)) {
            result[key] = this.mergeData(result[key], val);
          } else {
            result[key] = val;
          }
        }
      }
    });
    return result;
  },
  cleanData: function(data) {
    if (data === undefined || data === null) return data;
    if (Array.isArray(data)) {
      return data
        .filter(item => item !== undefined && item !== null)
        .map(item => this.cleanData(item));
    }
    if (typeof data === 'object') {
      const cleaned = {};
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const value = this.cleanData(data[key]);
          if (value !== undefined && value !== null) {
            cleaned[key] = value;
          }
        }
      }
      return cleaned;
    }
    return data;
  },
  normalizeData: function(data) {
    const cloned = this.deepClone(data);
    if (Array.isArray(cloned)) {
      return cloned.map(item => this.normalizeData(item));
    }
    if (typeof cloned === 'object' && cloned !== null) {
      const normalized = {};
      Object.keys(cloned).sort().forEach(key => {
        normalized[key.toLowerCase()] = this.normalizeData(cloned[key]);
      });
      return normalized;
    }
    return cloned;
  }
};

module.exports = utils;