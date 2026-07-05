import React, { useEffect, useState } from 'react';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Fetch unread notifications
    fetch('/api/notifications/unread')
      .then((res) => res.json())
      .then((data) => setNotifications(data));
  }, []);

  return (
    <div className="relative">
      <button 
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 bg-gray-200 rounded-full hover:bg-gray-300"
      >
        🔔
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] rounded-full px-1">
            {notifications.length}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-64 bg-white border shadow-lg rounded p-2 z-50">
          <h3 className="font-bold text-sm mb-2">Notifications</h3>
          {notifications.length === 0 ? (
            <p className="text-xs text-gray-500">No new alerts</p>
          ) : (
            notifications.map((n) => (
              <div key={n._id} className="text-xs border-b py-2">{n.message}</div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;