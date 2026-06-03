import React, { useState } from 'react';

const ImageUploader = () => {
  const [file, setFile] = useState(null);
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();

    // Create FormData to send both text data and the file
    const formData = new FormData();
    formData.append('image', file);
    formData.append('name', productName); // Ensure these names match your Product schema
    formData.append('price', price);

    try {
      const response = await fetch('http://localhost:3000/api/add-product', {
        method: 'POST',
        body: formData, // Automatically sets headers to multipart/form-data
      });

      const data = await response.json();
      console.log("Success:", data);
      alert("Product uploaded successfully!");
    } catch (error) {
      console.error("Error uploading product:", error);
    }
  };

  return (
    <form onSubmit={handleUpload} className="p-4 border rounded">
      <h3>Add New Product</h3>
      <input 
        type="text" 
        placeholder="Product Name" 
        onChange={(e) => setProductName(e.target.value)} 
        required 
      />
      <input 
        type="number" 
        placeholder="Price" 
        onChange={(e) => setPrice(e.target.value)} 
        required 
      />
      <input 
        type="file" 
        onChange={(e) => setFile(e.target.files[0])} 
        required 
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Upload Product
      </button>
    </form>
  );
};

export default ImageUploader;