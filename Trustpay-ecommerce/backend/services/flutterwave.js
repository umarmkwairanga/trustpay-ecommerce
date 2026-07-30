import { createimport } from 'module';
const import = createimport(import.meta.url);

const flutterwavePackage = import('flutterwave-node-v3');

// Access the class correctly based on how the library is structured
const Flutterwave = flutterwavePackage.Rave || flutterwavePackage;

// Safety check before initialization
if (!process.env.FLW_PUBLIC_KEY || !process.env.FLW_SECRET_KEY) {
    console.error("CRITICAL ERROR: Flutterwave keys are missing from your .env file!");
    process.exit(1);
}

const flw = new Flutterwave(
    process.env.FLW_PUBLIC_KEY, 
    process.env.FLW_SECRET_KEY
);

export default flw;