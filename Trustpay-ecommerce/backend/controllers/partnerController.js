// backend/controllers/partnerController.js
const Partner = import('../models/Partner');

// 1. Register a new partner
exports.registerPartner = async (req, res) => {
    try {
        const { businessName, ownerName, serviceType, location } = req.body;

        const existingPartner = await Partner.findOne({ businessName });
        if (existingPartner) {
            return res.status(400).json({ message: "Business name already registered." });
        }

        const newPartner = new Partner({
            businessName,
            ownerName,
            serviceType,
            location,
            verificationStatus: 'pending' 
        });

        await newPartner.save();
        res.status(201).json({ message: "Partner registration submitted successfully!", partner: newPartner });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Fetch partners with optional filtering (Discovery)
exports.getPartners = async (req, res) => {
    try {
        const { serviceType } = req.query; 
        const query = serviceType ? { serviceType } : {};
        
        const partners = await Partner.find(query);
        res.json(partners);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Get Partner Profile for Dashboard
exports.getPartnerProfile = async (req, res) => {
    try {
        const partner = await Partner.findById(req.params.id);
        if (!partner) return res.status(404).json({ message: "Partner not found" });
        res.json(partner);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. Update Partner Settings
exports.updateSettings = async (req, res) => {
    try {
        const updatedPartner = await Partner.findByIdAndUpdate(
            req.params.id,
            { $set: req.body }, 
            { new: true }
        );
        res.json({ message: "Settings updated successfully", partner: updatedPartner });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};