import fs from 'fs';
import path from 'path';

console.log('Current working directory:', process.cwd());
console.log('Files in current directory:', fs.readdirSync('.'));

console.log('\nChecking one level up (../):', path.resolve('../'));
try {
    console.log('Files one level up:', fs.readdirSync('../'));
} catch (e) {
    console.log('Could not read upper directory');
}

console.log('\nChecking two levels up (../../):', path.resolve('../../'));
try {
    console.log('Files two levels up:', fs.readdirSync('../../'));
} catch (e) {
    console.log('Could not read two levels up');
}