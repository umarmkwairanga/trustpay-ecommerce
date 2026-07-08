import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { sendSMS } from '../services/twilioService.js'; // Import your Twilio service wrapper

export const register = async (req, res) => {
    try {
        // 1. Destructure phoneNumber along with the other user fields
        const { username, email, password, role, phoneNumber } = req.body;
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // 2. Create the user in MongoDB (make sure your User model schema includes phoneNumber)
        await User.create({ 
            username, 
            email, 
            password: hashedPassword, 
            role: role || 'user',
            phoneNumber 
        });

        // 3. Format the phone number dynamically to standard E.164 international format
        let formattedPhone = phoneNumber;
        if (formattedPhone && formattedPhone.startsWith('0')) {
            // Converts '09033489644' -> '+2349033489644'
            formattedPhone = '+234' + formattedPhone.substring(1);
        }

        // 4. Send the welcome SMS notification
        if (formattedPhone) {
            const smsMessage = `Welcome to Trustpay, ${username}! Your register was successful. 🚀`;
            const smsResult = await sendSMS(formattedPhone, smsMessage);
            
            if (!smsResult.success) {
                console.error('Failed to send welcome SMS:', smsResult.error);
                // We don't break the response here so the registration still finishes even if SMS fails
            }
        }

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Invalid credentials" });
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
            res.json({ token, role: user.role });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};