// File: backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFoundHandler, validationHandler, globalErrorHandler } = require('./middlewares/errorHandlers');
const dns = require("dns");

// Smart trick for mongodb Atlas connectivity issues
dns.setServers(["1.1.1.1", "8.8.8.8"]);

// initialize App
const app = express();

// connect to database
connectDB();

// global middlewares
app.use(cors()); // allow frontend to communicate
app.use(express.json()); // parse json bodies

// ROUTES ->
// default health check route only once 
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Program Intelligence API is running perfectly!' });
});

// import and use exact api routes
const dashboardRoutes = require('./routes/dashboardRoutes');
const districtRoutes = require('./routes/districtRoutes');
const grantRoutes = require('./routes/grantRoutes');
const narrativeRoutes = require('./routes/narrativeRoutes');

app.use('/api/dashboard', dashboardRoutes);
app.use('/api/districts', districtRoutes);
app.use('/api/grants', grantRoutes);
app.use('/api/narrative', narrativeRoutes);


//error handling middlewares
// These MUST be placed after all routes
app.use(notFoundHandler);     // 1 catch 404
app.use(validationHandler);   // 2 catch db validation errors
app.use(globalErrorHandler);  // 3 catch general server crashes

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` server running on port ${PORT}`);
});