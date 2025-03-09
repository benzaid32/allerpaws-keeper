
const express = require('express');
const path = require('path');
const compression = require('compression');
const app = express();
const PORT = process.env.PORT || 8082;

// Enable gzip compression for all responses
app.use(compression());

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Handle SPA routing - serve index.html for all routes except files with extensions
app.get('*', (req, res) => {
  // Check if the request is for a file (has extension)
  if (req.url.includes('.') && !req.url.includes('index.html')) {
    console.log(`File request detected: ${req.url}`);
    // Let express.static handle it
    next();
  } else {
    console.log(`SPA route detected: ${req.url}, serving index.html`);
    // Always serve the index.html for routes that don't match a static file
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
