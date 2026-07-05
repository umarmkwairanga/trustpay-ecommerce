import React, { useState, useEffect } from 'react';
import API from '../api';

const StaffDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await API.get('/tasks');
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      {/* Brand-consistent heading */}
      <h1 className="text-2xl font-bold mb-6" style={{ color: '#001F5B' }}>
        Staff Task Portal
      </h1>

      {loading ? (
        <p>Loading your tasks...</p>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            /* Updated to use your 'card' class with Navy branding */
            <div 
              key={task._id} 
              className="card border-l-4" 
              style={{ borderLeftColor: '#001F5B' }}
            >
              <h3 className="font-bold text-lg" style={{ color: '#001F5B' }}>
                {task.title}
              </h3>
              <p className="text-gray-600">{task.description}</p>
              <div className="mt-2 text-sm text-gray-500">
                Status: <span className="font-semibold" style={{ color: '#001F5B' }}>
                  {task.status || 'Pending'}
                </span>
              </div>
            </div>
          ))}
          {tasks.length === 0 && <p>No tasks assigned at the moment.</p>}
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;