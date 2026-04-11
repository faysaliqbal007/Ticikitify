// Force Google DNS to bypass router DNS that may block MongoDB SRV records
const dns = require('dns'); // Import Node.js built-in DNS module
dns.setServers(['8.8.8.8', '8.8.4.4']); // Set DNS servers to Google's public DNS

// Import Express framework to create the backend server
const express = require('express');

// Import Mongoose to connect and interact with MongoDB
const mongoose = require('mongoose');

// Import CORS middleware to allow cross-origin requests from frontend
const cors = require('cors');

// Load environment variables from .env file into process.env
require('dotenv').config();

// Import authentication routes (login, register etc.)
const authRoutes = require('./routes/auth');

// Import user-related routes (profile, user data etc.)
const userRoutes = require('./routes/users');

// Import event-related routes (create event, get events etc.)
const eventRoutes = require('./routes/events');

// Create the main Express application instance
const app = express();


// ─── Middleware ────────────────────────────────────────────────────────────────

// Enable CORS with custom configuration
app.use(cors({
  origin: (origin, callback) => { // Function that checks if request origin is allowed

    // Allow requests from localhost (any port) OR requests with no origin
    // No origin happens when using Postman, mobile apps, or curl
    if (
      !origin || 
      origin === 'null' ||
      origin.startsWith('http://localhost:') || 
      origin.includes('sslcommerz.com')
    ) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error(`Not allowed by CORS. Origin: ${origin}`)); 
    }
  },

  credentials: true, // Allow cookies, authentication headers, and sessions
}));

// Parse incoming JSON requests (body data) with max size 10MB
app.use(express.json({ limit: '10mb' })); // Useful for large data like base64 images

// Parse URL-encoded form data (like HTML form submissions)
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


// ─── Routes ────────────────────────────────────────────────────────────────────

// Mount authentication routes under /api/auth
// Example: POST /api/auth/login
app.use('/api/auth', authRoutes);

// Mount user routes under /api/users
// Example: GET /api/users
app.use('/api/users', userRoutes);

// Mount event routes under /api/events
// Example: GET /api/events
app.use('/api/events', eventRoutes);

// Mount ticket routes under /api/tickets
const ticketRoutes = require('./routes/tickets');
app.use('/api/tickets', ticketRoutes);

// Mount promoCodes routes under /api/promoCodes
const promoCodeRoutes = require('./routes/promoCodes');
app.use('/api/promoCodes', promoCodeRoutes);


// ─── Health check ──────────────────────────────────────────────────────────────

// Create a simple API endpoint to check if server is running
app.get('/api/health', (req, res) => {

  // Send JSON response showing server status and current time
  res.json({
    status: 'ok', // Server is working
    message: 'Ticikitify API is running', // Informational message
    time: new Date().toISOString() // Current server time in ISO format
  });

});


// ─── 404 Handler ───────────────────────────────────────────────────────────────

// Catch all requests that did not match any defined route
app.use((req, res) => {

  // Send 404 status with message showing which route was not found
  res.status(404).json({
    message: `Route ${req.originalUrl} not found`
  });

});


// ─── Error Handler ─────────────────────────────────────────────────────────────

// Global error handling middleware
app.use((err, req, res, next) => {

  // Print error message in server console for debugging
  console.error('[Server Error]', err.message);

  // Send error response to client
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });

});


// ─── Database + Server Start ───────────────────────────────────────────────────

// Define server port from environment variable OR default to 5000
const PORT = process.env.PORT || 5000;


// Connect to MongoDB database using connection string from .env
mongoose
  .connect(process.env.MONGODB_URI)

  // If connection succeeds
  .then(() => {

    // Print success message in console
    console.log('Connected to MongoDB Atlas');

    // Start Express server on defined port
    app.listen(PORT, () => {

      // Show server URL in terminal
      console.log(`Server running at http://localhost:${PORT}`);

      // Show health check endpoint
      console.log(` Health check: http://localhost:${PORT}/api/health`);

    });

  })

  // If MongoDB connection fails
  .catch((err) => {

    // Print database connection error
    console.error('MongoDB connection failed:', err.message);

    // Suggest checking MongoDB URI in environment file
    console.error('Check your MONGODB_URI in server/.env');

    // Exit the Node.js process with error code
    process.exit(1);

  });
