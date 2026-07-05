import SupportTicket from '../models/SupportTicket.js';

export const createTicket = async (req, res) => {
    try {
        const ticket = await SupportTicket.create({ ...req.body, status: 'Pending' });
        res.status(201).json(ticket);
    } catch (error) {
        res.status(500).json({ message: "Failed to submit ticket" });
    }
};

export const getAllTickets = async (req, res) => {
    const tickets = await SupportTicket.find().sort({ createdAt: -1 });
    res.status(200).json(tickets);
};