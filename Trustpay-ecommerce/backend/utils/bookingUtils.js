// Simple function to generate a human-readable booking code
exports.generateUniqueRef = () => {
    return 'TP-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};