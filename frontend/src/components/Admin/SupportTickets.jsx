import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SupportTickets = () => {
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        const fetchTickets = async () => {
            const res = await axios.get('/api/admin/support-tickets');
            setTickets(res.data);
        };
        fetchTickets();
    }, []);

    const resolveTicket = async (ticketId) => {
        await axios.put(`/api/admin/support-tickets/${ticketId}`, { status: 'Resolved' });
        // Refresh list
        setTickets(tickets.filter(t => t._id !== ticketId));
    };

    return (
        <div className="support-container">
            <h2>Customer Support Tickets</h2>
            {tickets.map((ticket) => (
                <div key={ticket._id} className="ticket-card">
                    <p><strong>Subject:</strong> {ticket.subject}</p>
                    <p><strong>Message:</strong> {ticket.message}</p>
                    <button onClick={() => resolveTicket(ticket._id)}>Mark as Resolved</button>
                </div>
            ))}
        </div>
    );
};

export default SupportTickets;