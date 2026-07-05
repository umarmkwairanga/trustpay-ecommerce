import React, { useEffect, useState } from 'react';
import API from '../api';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data } = await API.get('/admin/audit-logs');
        setLogs(data);
      } catch (err) {
        console.error("Error fetching logs", err);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="bg-white p-6 shadow-md rounded mt-8">
      <h2 className="text-xl font-semibold mb-4">System Audit Logs</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-3">Date</th>
              <th className="p-3">Admin</th>
              <th className="p-3">Action</th>
              <th className="p-3">Target ID</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="p-3">{log.actor?.name || 'System'}</td>
                <td className="p-3 font-mono text-sm">{log.action}</td>
                <td className="p-3 text-xs">{log.targetId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogs;