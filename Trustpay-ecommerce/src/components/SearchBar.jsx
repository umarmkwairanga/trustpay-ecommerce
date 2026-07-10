import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value); // This sends the text to the parent component
  };

  return (
    <div className="flex-1 max-w-md mx-4">
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={handleChange}
        className="w-full px-4 py-2 rounded-md text-gray-900 border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
  );
};

export default SearchBar;