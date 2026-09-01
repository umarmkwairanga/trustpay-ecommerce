/**
 * CRITICAL SECURITY GUARD:
 * Prevents AI from executing direct unauthorized modifications to financial systems,
 * wallets, escrow, withdrawals, roles, or security credentials.
 */
exports.enforceAIBoundaries = (req, res, next) => {
  const restrictedActions = [
    'UPDATE_WALLET', 
    'RELEASE_ESCROW', 
    'APPROVE_WITHDRAWAL', 
    'CHANGE_ROLE', 
    'MODIFY_PAYMENT', 
    'OVERRIDE_FEE_DIRECTLY', 
    'RESOLVE_DISPUTE_AUTOMATICALLY', 
    'ISSUE_CERTIFICATE_UNVERIFIED'
  ];

  const requestedAction = req.body.action || req.headers['x-ai-action'];

  if (restrictedActions.includes(requestedAction)) {
    return res.status(403).json({
      success: false,
      error: 'SECURITY_VIOLATION',
      message: 'AI SECURITY BLOCK: AI is strictly prohibited from executing direct financial, settlement, or administrative overrides. Action must pass through authorized Admin/CEO confirmation and strict backend validation.'
    });
  }

  next();
};