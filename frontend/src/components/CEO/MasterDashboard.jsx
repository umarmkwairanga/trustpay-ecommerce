// components/CEO/CEODashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CEODashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Fetch aggregated data from your secure CEO endpoint
    const fetchCEOStats = async () => {
      const { data } = await axios.get('/api/ceo/dashboard-stats');
      setStats(data);
    };
    fetchCEOStats();
  }, []);

  if (!stats) return <div>Loading Intelligence...</div>;

  return (
    <div className="ceo-container" style={{ backgroundColor: '#F7F9FC' }}>
      <h1>Executive Command Center</h1>
      
      {/* KPI Section */}
      <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        <div className="card"><h3>Total Revenue</h3><p>₦{stats.totalRevenue.toLocaleString()}</p></div>
        <div className="card"><h3>Escrow Balance</h3><p>₦{stats.escrowBalance.toLocaleString()}</p></div>
        <div className="card"><h3>Active Users</h3><p>{stats.activeUsers}</p></div>
        <div className="card"><h3>Open Disputes</h3><p>{stats.disputeCount}</p></div>
      </div>

      {/* Analytics Section */}
      <div className="analytics-section">
        {/* Insert your Charts here (e.g., Recharts library) */}
        <h2>Revenue Trends (Last 30 Days)</h2>
        {/* Chart Component */}
      </div>
    </div>
  );
};

export default CEODashboard;