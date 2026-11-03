const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide your work email'],
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },
    company: {
      type: String,
      trim: true,
      default: 'Independent / Stealth'
    },
    service: {
      type: String,
      required: [true, 'Please select a primary service'],
      enum: [
        'Social Media Management',
        'Influencer Marketing',
        'Digital Marketing & Paid Growth',
        'Full Integrated Growth Package',
        'Other'
      ]
    },
    budget: {
      type: String,
      default: '$3,000 – $6,000 / month'
    },
    message: {
      type: String,
      required: [true, 'Please provide project details or goals'],
      trim: true
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Closed'],
      default: 'New'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Inquiry', inquirySchema);

