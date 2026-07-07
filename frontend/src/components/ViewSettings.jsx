import React, { useState, useEffect } from 'react';

const ViewSettings = () => {
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    // Toggle the class on the body element
    if (isCompact) {
      document.body.classList.add('compact-mode');
    } else {
      document.body.classList.remove('compact-mode');
    }
  }, [isCompact]);

  return (
    <div className="view-settings-menu">
      <label>
        <input 
          type="checkbox" 
          checked={isCompact} 
          onChange={() => setIsCompact(!isCompact)} 
        />
        Enable compact line height
      </label>
    </div>
  );
};