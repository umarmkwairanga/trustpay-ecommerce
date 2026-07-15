import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PayoutPanel = () => {
    const [payoutQueue, setPayoutQueue] = useState([]);

    useEffect(() => {
        const fetchPayouts = async () => {
            try {
                // Fetch orders that are ready for payout
                const res = await axios.get('/api/admin/payout-queue');
                setPayoutQueue(res.data);
            } catch (err) {
                console.error("Error fetching payouts", err);
            }
        };
        fetchPayouts();
    }, []);

    return (
        <div>
            <h1>Payout Dashboard</h1>
            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {payoutQueue.map(order => (
                        <tr key={order._id}>
                            <td>{order._id}</td>
                            <td>{order.totalAmount}</td>
                            <td>{order.status}</td>
                            <td>
                                <button>Process Payout</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PayoutPanel;