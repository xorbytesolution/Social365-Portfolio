const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const inquiryRoutes = require('./routes/inquiryRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    agency: 'Social365 Enterprise Backend',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/inquiries', inquiryRoutes);

app.listen(PORT, () => {
  console.log(`[Social365 Server] Running on http://localhost:${PORT}`);
});

