import Flutterwave from 'flutterwave-node-v3';

// Ensure your .env has FLW_PUBLIC_KEY and FLW_SECRET_KEY
const flw = new Flutterwave(
    process.env.FLW_PUBLIC_KEY, 
    process.env.FLW_SECRET_KEY
);

export default flw;