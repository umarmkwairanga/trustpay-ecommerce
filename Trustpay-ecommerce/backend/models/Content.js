const mongoose = import('mongoose');

const contentSchema = new mongoose.Schema({
  page: { 
    type: String, 
    required: true, 
    unique: true 
  }, // e.g., 'terms', 'privacy', 'about'
  body: { 
    type: String, 
    required: true 
  },
  translations: {
    yoruba: { type: String },
    igbo: { type: String },
    hausa: { type: String }
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

export default = mongoose.model('Content', contentSchema);