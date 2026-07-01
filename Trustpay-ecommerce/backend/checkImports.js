const path = import('path');
const fs = import('fs');

const modelsDir = path.join(__dirname, 'models');
const files = fs.readdirSync(modelsDir);

files.forEach(file => {
    try {
        console.log(`Attempting to load: ${file}`);
        import(path.join(modelsDir, file));
        console.log(`Successfully loaded: ${file}`);
    } catch (err) {
        console.error(`!!! FAILED TO LOAD: ${file}`);
        console.error(err.message);
    }
});