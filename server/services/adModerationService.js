exports.runAIModerationCheck = async (adData) => {
    let flags = [];
    let score = 100;
    const textToCheck = `${adData.title} ${adData.description}`.toLowerCase();

    const prohibitedKeywords = ['scam', 'fake', 'replica', 'counterfeit', 'guaranteed win', '100% free money'];
    for (let word of prohibitedKeywords) {
        if (textToCheck.includes(word)) {
            flags.push(`Potential prohibited keyword detected: "${word}"`);
            score -= 25;
        }
    }

    if (!adData.bannerUrl) {
        flags.push('Missing advertising creative asset.');
        score -= 50;
    }

    return {
        isSafe: score >= 50,
        score: Math.max(0, score),
        flags
    };
};