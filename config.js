const validateInput = (input) => {
    const isValid = typeof input === 'string' && input.trim() !== '';
    if (!isValid) {
        throw new Error('Invalid input: Must be a non-empty string.');
    }
    return true;
};

const processInput = (input) => {
    try {
        validateInput(input);
        console.log('Processing input:', input);
        // Main processing logic here
    } catch (error) {
        console.error('Error processing input:', error.message);
    }
};

const inputs = ['valid string', '', '   ', 42];
inputs.forEach((input) => processInput(input));