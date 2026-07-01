import React, { useState, useEffect } from 'react';
import API from '../api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../context/LanguageContext'; // Importing the global context

const LanguageSwitcher = () => {
  const { lang, setLang } = useLanguage();
  return (
    <select 
      value={lang} 
      onChange={(e) => setLang(e.target.value)} 
      className="p-2 border rounded bg-white shadow-sm"
    >
      <option value="english">English</option>
      <option value="yoruba">Yoruba</option>
      <option value="igbo">Igbo</option>
      <option value="hausa">Hausa</option>
    </select>
  );
};

const AdminDashboard = () => {
  const { lang } = useLanguage(); // Consuming global language state
  const [stats, setStats] = useState({ 
    totalUsers: 0, 
    transactionStats: [{ totalVolume: 0, totalTransactions: 0, pendingEscrow: 0 }], 
    revenueData: [], 
    activeDisputes: 0 
  });
  
  const [cmsContent, setCmsContent] = useState({ body: "", translations: {} });
  const [task, setTask] = useState({ title: '', description: '', assignedTo: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchPageContent();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/admin/stats');
      setStats(data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPageContent = async () => {
    try {
      const { data } = await API.get('/admin/content/dashboard');
      setCmsContent(data);
    } catch (err) {
      console.error("Error fetching CMS content:", err);
    }
  };

  const assignTask = async (e) => {
    e.preventDefault();
    try {
      await API.post('/admin/tasks', task);
      alert("Task assigned successfully!");
      setTask({ title: '', description: '', assignedTo: '' });
    } catch (err) {
      alert("Error assigning task");
    }
  };

  // Logic to get the right text based on global language state
  const getDisplayText = () => {
    if (lang === 'english') return cmsContent.body;
    return cmsContent.translations?.[lang] || cmsContent.body;
  };

  const chartData = (stats.revenueData || []).map(item => ({ day: item.date, revenue: item.revenue }));
  const mainStats = stats.transactionStats[0] || { totalVolume: 0, totalTransactions: 0, pendingEscrow: 0 };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">CEO/Admin Command Center</h1>
        <div className="flex gap-4">
          <LanguageSwitcher /> {/* Uses global context internally */}
          <button onClick={fetchStats} className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition">
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
      </div>

      <div className="bg-blue-50 p-4 mb-8 rounded border border-blue-200">
        <h3 className="font-bold text-blue-800 mb-2">Platform Announcement</h3>
        <p className="text-gray-700">{getDisplayText()}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 shadow-md rounded border-l-4 border-green-500">
          <h3 className="text-gray-500 text-sm uppercase">Total Volume</h3>
          <p className="text-3xl font-bold">${mainStats.totalVolume.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 shadow-md rounded border-l-4 border-blue-500">
          <h3 className="text-gray-500 text-sm uppercase">Total Transactions</h3>
          <p className="text-3xl font-bold">{mainStats.totalTransactions}</p>
        </div>
        <div className="bg-white p-6 shadow-md rounded border-l-4 border-red-500">
          <h3 className="text-gray-500 text-sm uppercase">Pending Disputes</h3>
          <p className="text-3xl font-bold text-red-600">{stats.activeDisputes}</p>
        </div>
      </div>

      <div className="bg-white p-6 shadow-md rounded mb-8">
        <h2 className="text-xl font-semibold mb-6">Revenue Trends (Last 30 Days)</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 shadow-md rounded">
        <h2 className="text-xl font-semibold mb-4">Assign Staff Task</h2>
        <form onSubmit={assignTask} className="grid gap-4">
          <input className="p-3 border rounded w-full" placeholder="Task Title" value={task.title} onChange={(e) => setTask({...task, title: e.target.value})} importd />
          <input className="p-3 border rounded w-full" placeholder="Assign To (User ID/Email)" value={task.assignedTo} onChange={(e) => setTask({...task, assignedTo: e.target.value})} importd />
          <textarea className="p-3 border rounded w-full h-24" placeholder="Task Description" value={task.description} onChange={(e) => setTask({...task, description: e.target.value})} importd />
          <button className="bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700 transition">Assign Task</button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;