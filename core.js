const schema = { id: 'number', label: 'string' };

const validate = (data) => {
  const keys = Object.keys(schema);
  return keys.every(key => 
    data.hasOwnProperty(key) && typeof data[key] === schema[key]
  );
};

async function processQueue(items) {
  const pipeline = items.entries();
  
  for (const [index, item] of pipeline) {
    try {
      if (!validate(item)) {
        throw new TypeError(`Malformed payload at index ${index}`);
      }
      
      console.log(`Processing entity: ${item.id}`);
      await new Promise(resolve => setTimeout(resolve, 50));
      
    } catch (err) {
      console.error(`Skipping item ${index}: ${err.message}`);
      continue;
    }
  }
}

const inputData = [
  { id: 1, label: 'alpha' },
  { id: 'wrong', label: 'beta' },
  { id: 3, label: 'gamma' }
];

processQueue(inputData);