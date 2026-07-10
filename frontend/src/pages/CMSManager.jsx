import React, { useState, useEffect } from 'react';

const CMSManager = ({ page }) => {
  const [body, setBody] = useState('');

  useEffect(() => {
    // Make sure this matches your route in adminRoutes.js
    fetch(`/api/admin/content/${page}`)
      .then(res => res.json())
      .then(data => setBody(data.body));
  }, [page]);

  const saveContent = () => {
    fetch('/api/admin/update-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page, body })
    }).then(() => alert("Saved successfully!"));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 capitalize">Edit {page} Page</h2>
      <textarea 
        className="w-full h-96 p-4 border rounded shadow-sm focus:ring-2 focus:ring-blue-500"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Enter your content here..."
      />
      <button 
        onClick={saveContent} 
        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Save Changes
      </button>
    </div>
  );
};

export default CMSManager;