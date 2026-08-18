function validateInput(input) {
    if (typeof input !== 'string') {
        throw new Error('Input must be a string');
    }
    if (input.trim() === '') {
        throw new Error('Input cannot be empty');
    }
    return true;
}

function processInputs(inputs) {
    try {
        inputs.forEach((input) => {
            validateInput(input);
            // Continue with processing if input is valid
            console.log(`Processing: ${input}`);
        });
    } catch (error) {
        console.error(`Error processing inputs: ${error.message}`);
    }
}

// Sample main processing loop 
const inputs = ['validInput', '', 42];
processInputs(inputs);