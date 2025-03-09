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
  // Check if the request is for a static file with an extension
  const fileExtensionRegex = /\.\w+$/;
  if (fileExtensionRegex.test(req.url) && !req.url.includes('index.html')) {
    console.log(`Static file request: ${req.url}`);
    return next(); // Let express.static handle it
  }
  
  // For all other routes (including /dashboard, /settings, etc.), serve the index.html
  console.log(`SPA route detected: ${req.url}, serving index.html`);
  
  // Set cache headers to prevent caching for the index.html for SPA routes
  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  
  // Always serve the index.html for routes that don't match a static file
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`SPA routing enabled - all routes will serve index.html`);
});
