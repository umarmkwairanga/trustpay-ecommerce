import React, { useState, useEffect } from 'react';
import api from '../services/api'; // or your configured axios instance

const AddProductForm = () => {
  // Existing states...
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [images, setImages] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  // --- PHASE 5 NEW STATES ---
  const [categoryMode, setCategoryMode] = useState('existing'); // 'existing' | 'dynamic'
  const [proposedCategory, setProposedCategory] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState(null); // null | 'checking' | 'approved_new' | 'approved_existing' | 'rejected' | 'review_required'

  useEffect(() => {
    // Fetch categories on mount
    const fetchCategories = async () => {
      try {
        const res = await api.get('/api/categories');
        setCategories(res.data.categories || res.data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCategories();
  }, []);

  // --- PHASE 5 SUBMISSION HANDLER ---
  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    setSubmissionStatus('checking');

    try {
      const payload = {
        name,
        description,
        price,
        stock,
        category: categoryMode === 'existing' ? selectedCategoryId : null,
        proposedCategory: categoryMode === 'dynamic' ? proposedCategory : null,
        imagePath: images // Adjust according to your backend schema field name (imagePath vs images)
      };

      const response = await api.post('/api/products', payload);
      
      if (response.data.success) {
        if (response.data.decision === 'APPROVED_NEW_CATEGORY') {
          setSubmissionStatus('approved_new');
        } else {
          setSubmissionStatus('approved_existing');
        }
      }
    } catch (error) {
      const msg = error.response?.data?.message || '';
      if (msg.includes('cannot be listed')) {
        setSubmissionStatus('rejected');
      } else if (error.response?.status === 202) {
        setSubmissionStatus('review_required');
      } else {
        setSubmissionStatus('error');
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmitProduct}>
        
        {/* Other input fields like name, price, description, etc. go here */}
        <div className="form-group mb-3">
          <label>Product Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="form-control" 
            required 
          />
        </div>

        {/* --- PHASE 5 CATEGORY SELECTION JSX --- */}
        <div className="form-group mb-3">
          <label>Product Category</label>
          <select 
            value={categoryMode === 'existing' ? selectedCategoryId : 'dynamic_option'} 
            onChange={(e) => {
              if (e.target.value === 'dynamic_option') {
                setCategoryMode('dynamic');
                setSelectedCategoryId('');
              } else {
                setCategoryMode('existing');
                setSelectedCategoryId(e.target.value);
              }
            }}
            className="form-control"
          >
            <option value="">[ Select Category ]</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
            <option value="dynamic_option">[ + My product doesn't fit any category ]</option>
          </select>
        </div>

        {categoryMode === 'dynamic' && (
          <div className="form-group mb-3">
            <label>Proposed Category Name</label>
            <input 
              type="text" 
              value={proposedCategory} 
              onChange={(e) => setProposedCategory(e.target.value)} 
              placeholder="e.g. Beekeeping Equipment" 
              className="form-control"
              required 
            />
          </div>
        )}

        {/* --- STATUS FEEDBACK BANNERS --- */}
        {submissionStatus === 'checking' && <div className="alert alert-info">AI is checking your product...</div>}
        {submissionStatus === 'approved_new' && <div className="alert alert-success">✓ Product approved<br/>✓ New category created</div>}
        {submissionStatus === 'approved_existing' && <div className="alert alert-success">✓ Existing category selected & Product approved</div>}
        {submissionStatus === 'rejected' && <div className="alert alert-danger">✕ This product cannot be listed.</div>}
        {submissionStatus === 'review_required' && <div className="alert alert-warning">⚠ This product has been sent for TrustPay Admin review.</div>}
        {submissionStatus === 'error' && <div className="alert alert-danger">✕ An error occurred while submitting your product.</div>}

        <button type="submit" className="btn btn-primary mt-3">Submit Product</button>
      </form>
    </div>
  );
};

export default AddProductForm;