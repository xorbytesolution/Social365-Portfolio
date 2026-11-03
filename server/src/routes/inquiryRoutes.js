const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');

// Fallback in-memory store if MongoDB is not running locally yet
let inMemoryInquiries = [];

/**
 * @route   POST /api/inquiries
 * @desc    Submit a new lead inquiry from "Let's Talk" form
 */
router.post('/', async (req, res) => {
  try {
    const { name, email, company, service, budget, message } = req.body;

    if (!name || !email || !service || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please complete all required fields (Name, Email, Service, and Message).'
      });
    }

    try {
      const inquiry = await Inquiry.create({
        name,
        email,
        company,
        service,
        budget,
        message
      });
      return res.status(201).json({
        success: true,
        message: 'Thank you for contacting Social365! Our growth strategists will review your project and reply within 24 hours.',
        data: inquiry
      });
    } catch (dbErr) {
      // Graceful fallback to in-memory store so the app never crashes
      const fallbackInquiry = {
        id: Date.now().toString(),
        name,
        email,
        company,
        service,
        budget,
        message,
        createdAt: new Date()
      };
      inMemoryInquiries.push(fallbackInquiry);
      return res.status(201).json({
        success: true,
        message: 'Thank you! Your discovery inquiry has been received by Social365.',
        data: fallbackInquiry
      });
    }
  } catch (error) {
    console.error('Inquiry Submission Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error processing your inquiry. Please reach out directly to social365.work@gmail.com'
    });
  }
});

/**
 * @route   GET /api/inquiries
 * @desc    List inquiries (Admin/Review)
 */
router.get('/', async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    return res.json({ success: true, count: inquiries.length, data: inquiries });
  } catch (error) {
    return res.json({ success: true, count: inMemoryInquiries.length, data: inMemoryInquiries });
  }
});

module.exports = router;

