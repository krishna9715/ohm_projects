const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // Import the cors middleware
const authRoutes = require('./routes/authRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const DB_URI = process.env.DB_URI;

// Enable CORS - Allow requests from all origins (You can restrict this as needed)
app.use(cors({
  origin: 'http://localhost:3000', // Allow only your frontend origin
  credentials: true, // Allow cookies to be sent if needed
}));

// Middleware for parsing JSON
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// MongoDB connection
mongoose.connect(DB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
