import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                // Ensure your backend has this route defined
                const res = await axios.get('/api/admin/audit-logs'); 
                setLogs(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching audit logs", err);
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    if (loading) return <div>Loading CEO Audit Data...</div>;

    return (
        <div className="audit-container">
            <h2>System Audit Logs (CEO View)</h2>
            <table>
                <thead>
                    <tr>
                        <th>Timestamp</th>
                        <th>User/Admin</th>
                        <th>Action</th>
                        <th>Target ID</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log) => (
                        <tr key={log._id}>
                            <td>{new Date(log.timestamp).toLocaleString()}</td>
                            <td>{log.userId?.name || 'Admin'}</td>
                            <td><strong>{log.action}</strong></td>
                            <td>{log.targetId}</td>
                            <td>{log.details}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AuditLogs;