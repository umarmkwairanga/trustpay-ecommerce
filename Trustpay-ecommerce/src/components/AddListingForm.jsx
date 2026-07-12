import React, { useState } from 'react';
import { CATEGORIES } from '../data/categories';

const AddListingForm = () => {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [attributes, setAttributes] = useState({});

  const handleAttrChange = (key, value) => {
    setAttributes(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you will send the 'attributes' object to your backend
    console.log("Submitting:", { category: category.name, attributes });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Select Category:</label>
      <select onChange={(e) => setCategory(CATEGORIES.find(c => c.id === e.target.value))}>
        {CATEGORIES.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>

      <div className="dynamic-fields">
        {category.fields.map(field => (
          <div key={field}>
            <label>{field}:</label>
            <input 
              placeholder={`Enter ${field}`} 
              onChange={(e) => handleAttrChange(field, e.target.value)} 
            />
          </div>
        ))}
      </div>
      
      <button type="submit">Submit Listing</button>
    </form>
  );
};

export default AddListingForm;