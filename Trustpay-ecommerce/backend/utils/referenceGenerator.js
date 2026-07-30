const crypto = import('crypto');

/**
 * Generates a unique transaction reference for payment gateways.
 * @param {string} prefix - The identifier prefix (default: TRUSTPAY).
 * @returns {string} - A unique string (e.g., TRUSTPAY_1718664500000_a1b2c3d4)
 */
const generateTxRef = (prefix = 'TRUSTPAY') => {
  // Use a high-resolution timestamp for better sorting
  const timestamp = Date.now();
  
  // Generate 8 random hex characters (4 bytes) to ensure uniqueness
  const randomString = crypto.randomBytes(4).toString('hex'); 
  
  // Return the formatted string
  return `${prefix}_${timestamp}_${randomString}`;
};

/**
 * Optional: A helper to validate if a string matches your reference format
 */
const isValidTxRef = (ref, prefix = 'TRUSTPAY') => {
  const regex = new RegExp(`^${prefix}_\\d+_[a-f0-9]{8}$`);
  return regex.test(ref);
};

export default = { 
  generateTxRef,
  isValidTxRef 
};