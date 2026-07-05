import Flutterwave from 'flutterwave-node-v3';

export const initiatePayment = async (paymentDetails) => {
    // Initialize inside the function to ensure process.env is ready
    const flw = new Flutterwave(
        process.env.FLW_PUBLIC_KEY, 
        process.env.FLW_SECRET_KEY
    );

    try {
        const response = await flw.PaymentLink.create(paymentDetails);
        return response;
    } catch (error) {
        console.error("Flutterwave API Error:", error);
        throw error;
    }
};