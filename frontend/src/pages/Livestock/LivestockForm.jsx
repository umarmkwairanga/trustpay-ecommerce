import React, { useState } from 'react';

const LivestockForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    subcategory: 'cattle',
    breed: '',
    ageValue: '',
    ageUnit: 'months',
    weightValue: '',
    weightUnit: 'kg',
    gender: 'unsexed',
    quantityAvailable: 1,
    pricePerUnit: '',
    healthNotes: '',
    description: '',
    state: '',
    city: '',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Handle standard input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Call the AI Description Generator Endpoint
  const handleGenerateAI = async () => {
    if (!formData.subcategory || !formData.breed) {
      setMessage({ type: 'error', text: 'Please fill in the subcategory and breed first.' });
      return;
    }

    setIsGenerating(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token'); // Adjust based on your auth setup
      const response = await fetch('/api/livestock/generate-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subcategory: formData.subcategory,
          breed: formData.breed,
          age: { value: formData.ageValue, unit: formData.ageUnit },
          weight: { value: formData.weightValue, unit: formData.weightUnit },
          gender: formData.gender,
          healthNotes: formData.healthNotes,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setFormData((prev) => ({ ...prev, description: data.data }));
        setMessage({ type: 'success', text: 'AI Description generated successfully!' });
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Server connection error.' });
    } finally {
      setIsGenerating(false);
    }
  };

  // Submit the entire form to create the listing
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    // Format data to match the Mongoose schema structure
    const payload = {
      title: formData.title,
      category: 'Livestock',
      subcategory: formData.subcategory,
      breed: formData.breed,
      age: { value: Number(formData.ageValue), unit: formData.ageUnit },
      weight: { value: Number(formData.weightValue), unit: formData.weightUnit },
      gender: formData.gender,
      quantityAvailable: Number(formData.quantityAvailable),
      pricePerUnit: Number(formData.pricePerUnit),
      healthStatus: { healthNotes: formData.healthNotes },
      description: formData.description,
      location: { state: formData.state, city: formData.city },
      // Note: Images array requires integration with your file upload middleware
      images: ['placeholder-image-url.jpg'], 
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/livestock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Livestock listing created successfully!' });
        // Optional: Redirect user to seller dashboard or clear form here
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to create listing.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 border-b pb-2">List Livestock for Sale</h2>
      
      {message.text && (
        <div className={`p-4 mb-4 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Listing Title *</label>
            <input type="text" name="title" required value={formData.title} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" placeholder="e.g., Healthy Brahman Bull" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price Per Unit (NGN) *</label>
            <input type="number" name="pricePerUnit" required min="0" value={formData.pricePerUnit} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
          </div>
        </div>

        {/* Animal Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Type *</label>
            <select name="subcategory" required value={formData.subcategory} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2">
              <option value="cattle">Cattle</option>
              <option value="goats">Goats</option>
              <option value="sheep">Sheep</option>
              <option value="poultry">Poultry</option>
              <option value="fish">Fish</option>
              <option value="rabbits">Rabbits</option>
              <option value="horses">Horses</option>
              <option value="swine">Swine</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Breed *</label>
            <input type="text" name="breed" required value={formData.breed} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2">
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="mixed">Mixed</option>
              <option value="unsexed">Unsexed</option>
            </select>
          </div>
        </div>

        {/* Metrics: Age & Weight */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Age Value *</label>
            <input type="number" name="ageValue" required min="0" value={formData.ageValue} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Age Unit</label>
            <select name="ageUnit" value={formData.ageUnit} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2">
              <option value="days">Days</option>
              <option value="weeks">Weeks</option>
              <option value="months">Months</option>
              <option value="years">Years</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Weight Value *</label>
            <input type="number" name="weightValue" required min="0" value={formData.weightValue} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Weight Unit</label>
            <select name="weightUnit" value={formData.weightUnit} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2">
              <option value="kg">KG</option>
              <option value="lbs">LBS</option>
              <option value="grams">Grams</option>
            </select>
          </div>
        </div>

        {/* Location & Quantity */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">State *</label>
            <input type="text" name="state" required value={formData.state} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">City *</label>
            <input type="text" name="city" required value={formData.city} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity Available *</label>
            <input type="number" name="quantityAvailable" required min="1" value={formData.quantityAvailable} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
          </div>
        </div>

        {/* Health & Description (AI Integration) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Health / Vaccination Notes</label>
          <input type="text" name="healthNotes" value={formData.healthNotes} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2 mb-4" placeholder="e.g., Fully vaccinated, dewormed last month" />
          
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Description *</label>
            <button 
              type="button" 
              onClick={handleGenerateAI}
              disabled={isGenerating}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1 px-3 rounded flex items-center"
            >
              {isGenerating ? 'Generating...' : '✨ Auto-Generate with AI'}
            </button>
          </div>
          <textarea 
            name="description" 
            required 
            rows="5" 
            value={formData.description} 
            onChange={handleChange} 
            className="block w-full border border-gray-300 rounded-md p-2"
            placeholder="Describe the livestock manually, or use the AI button above..."
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded"
        >
          {isSubmitting ? 'Publishing Listing...' : 'Publish Livestock Listing'}
        </button>
      </form>
    </div>
  );
};

export default LivestockForm;