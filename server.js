
const express = require('express');
const path = require('path');
const compression = require('compression');
const app = express();
const PORT = process.env.PORT || 8082;

// Enable gzip compression for all responses
app.use(compression());

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle SPA routing - all routes that don't match a file should serve index.html
app.get('*', (req, res, next) => {
  // Check if the request is for a file (has extension)
  if (req.url.indexOf('.') !== -1 && !req.url.includes('index.html')) {
    console.log(`Static file request: ${req.url}`);
    return next(); // Let express.static handle it
  }
  
  console.log(`SPA route detected: ${req.url}, serving index.html`);
  // Always serve the index.html for routes that don't match a static file
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`SPA routing enabled - all routes will serve index.html`);
});
