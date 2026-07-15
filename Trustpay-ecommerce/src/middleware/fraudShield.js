// middleware/fraudShield.js
export const assessFraudRisk = async (req, res, next) => {
    const { orderData } = req.body;
    
    // 1. Basic Heuristics
    let score = 0;
    let reasons = [];

    // Check 1: Is the price suspiciously high for this user's history?
    if (orderData.totalAmount > 500000) {
        score += 30;
        reasons.push("High value transaction");
    }

    // Check 2: Check for rapid-fire orders (Bot detection)
    // You would query your database to see if this user has > 3 orders in 1 minute
    
    // 2. Assign score
    req.body.riskScore = score;
    req.body.fraudReasoning = reasons.join(", ");

    // 3. Decision Gate
    if (score > 70) {
        return res.status(403).json({ 
            error: "Transaction flagged by TrustPay AI. Please contact support." 
        });
    }

    next();
};