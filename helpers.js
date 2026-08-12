function isValidInput(input) {
    return typeof input === 'string' && input.trim() !== '';
}

function processInput(input) {
    if (!isValidInput(input)) {
        throw new Error('Invalid input: must be a non-empty string.');
    }
    return input.trim().toUpperCase();
}

function mainProcessingLoop(inputs) {
    let results = [];
    for (let i = 0; i < inputs.length; i++) {
        try {
            const result = processInput(inputs[i]);
            results.push(result);
        } catch (error) {
            console.error(`Error processing input at index ${i}: ${error.message}`);
        }
    }
    return results;
}

// Example usage
const userInputs = [' hello ', '', 'world', '   '];
const processedResults = mainProcessingLoop(userInputs);
console.log(processedResults);  // Output: ['HELLO', 'WORLD']