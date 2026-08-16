const crypto = require('crypto');
const axios = require('axios');
const mongoose = require('mongoose');
const Escrow = require('../models/Escrow');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const Ledger = require('../models/Ledger');

// Initialize payment with Flutterwave
exports.initializePayment = async (req, res) => {
  try {
    const { amount, currency, email, name, phone, tx_ref, callback_url, metadata } = req.body;

    if (!amount || !currency || !email || !tx_ref) {
      return res.status(400).json({ success: false, message: 'Missing required payment parameters.' });
    }

    // Check for duplicate reference/idempotency
    const existingTx = await Transaction.findOne({ reference: tx_ref });
    if (existingTx) {
      return res.status(400).json({ success: false, message: 'Transaction reference already exists.' });
    }

    // Call Flutterwave API server-side (Never expose secret key on frontend)
    const flwResponse = await axios.post(
      'https://api.flutterwave.com/v3/payments',
      {
        tx_ref,
        amount,
        currency,
        redirect_url: callback_url || process.env.FLUTTERWAVE_CALLBACK_URL,
        customer: {
          email,
          name,
          phonenumber: phone
        },
        meta: metadata || {}
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (flwResponse.data && flwResponse.data.status === 'success') {
      // Record pending transaction in DB
      await Transaction.create({
        user: req.user.id,
        reference: tx_ref,
        amount,
        currency,
        status: 'PENDING',
        gateway: 'flutterwave',
        metadata
      });

      return res.status(200).json({
        success: true,
        payment_link: flwResponse.data.data.link,
        tx_ref
      });
    } else {
      return res.status(400).json({ success: false, message: 'Failed to initialize payment with gateway.' });
    }
  } catch (error) {
    console.error('Payment Initialization Error:', error.response?.data || error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Verify payment server-side (Never trust frontend success flags alone)
exports.verifyPayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { transaction_id, tx_ref } = req.body;

    if (!transaction_id && !tx_ref) {
      return res.status(400).json({ success: false, message: 'Transaction ID or Reference required.' });
    }

    const queryRef = tx_ref || transaction_id;
    
    // Verify with Flutterwave API
    const verifyUrl = transaction_id 
      ? `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`
      : `https://api.flutterwave.com/v3/transactions?tx_ref=${tx_ref}&status=successful`;

    const flwVerify = await axios.get(verifyUrl, {
      headers: {
        Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`
      }
    });

    const txnData = transaction_id ? flwVerify.data.data : flwVerify.data.data?.[0];

    if (!txnData || txnData.status !== 'successful') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: 'Payment verification failed or transaction not successful.' });
    }

    const reference = txnData.tx_ref;

    // Idempotency & Duplicate Protection Check
    const transactionRecord = await Transaction.findOne({ reference }).session(session);
    if (transactionRecord && transactionRecord.status === 'SUCCESS') {
      await session.abortTransaction();
      session.endSession();
      return res.status(200).json({ success: true, message: 'Transaction already verified and processed.' });
    }

    // Update transaction status
    if (transactionRecord) {
      transactionRecord.status = 'SUCCESS';
      transactionRecord.gatewayResponse = txnData;
      await transactionRecord.save({ session });
    } else {
      await Transaction.create([{
        user: req.user?.id || null,
        reference,
        amount: txnData.amount,
        currency: txnData.currency,
        status: 'SUCCESS',
        gateway: 'flutterwave',
        gatewayResponse: txnData
      }], { session });
    }

    // Update corresponding Escrow status if linked
    const escrow = await Escrow.findOne({ transactionReference: reference }).session(session);
    if (escrow && escrow.escrowStatus === 'PENDING') {
      escrow.escrowStatus = 'FUNDED';
      escrow.paymentStatus = 'PAID';
      await escrow.save({ session });

      // Create Ledger Entry for Escrow funding
      await Ledger.create([{
        user: escrow.buyer,
        type: 'DEBIT',
        amount: txnData.amount,
        reference,
        description: `Escrow funded for transaction reference ${reference}`
      }], { session });
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully and state updated.',
      data: txnData
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Payment Verification Error:', error.response?.data || error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Secure Webhook Endpoint with Signature Verification and Idempotency
exports.handleFlutterwaveWebhook = async (req, res) => {
  const secretHash = process.env.FLUTTERWAVE_WEBHOOK_HASH;
  const signature = req.headers['verif-hash'];

  // Validate webhook signature (Fixed return.status typo to return res.status)
  if (!signature || signature !== secretHash) {
    return res.status(401).json({ success: false, message: 'Unauthorized webhook signature' });
  }

  const event = req.body;

  if (event['event-data']?.status === 'successful' || event.status === 'successful') {
    const data = event.data || event;
    const txRef = data.tx_ref;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Idempotency check: Ensure transaction wasn't already processed
      const existingTx = await Transaction.findOne({ reference: txRef, status: 'SUCCESS' }).session(session);
      if (existingTx) {
        await session.abortTransaction();
        session.endSession();
        return res.status(200).json({ status: 'already processed' });
      }

      await Transaction.findOneAndUpdate(
        { reference: txRef },
        { status: 'SUCCESS', gatewayResponse: data },
        { upsert: true, new: true, session }
      );

      // Securely update escrow status server-side
      const escrow = await Escrow.findOne({ transactionReference: txRef }).session(session);
      if (escrow && escrow.escrowStatus === 'PENDING') {
        escrow.escrowStatus = 'FUNDED';
        escrow.paymentStatus = 'PAID';
        await escrow.save({ session });
      }

      await session.commitTransaction();
      session.endSession();
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.error('Webhook Processing Error:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(200).json({ received: true });
};