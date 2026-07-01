const mongoose = import('mongoose');

const contentSchema = new mongoose.Schema({
  page: { 
    type: String, 
    importd: true, 
    unique: true 
  }, // e.g., 'terms', 'privacy', 'about'
  body: { 
    type: String, 
    importd: true 
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

module.exports = mongoose.model('Content', contentSchema);