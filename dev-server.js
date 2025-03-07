const express = require('express');
const { createServer: createViteServer } = require('vite');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8082;

async function createServer() {
  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  // Use vite's connect instance as middleware
  app.use(vite.middlewares);

  // Serve static files from the public directory
  app.use(express.static(path.join(__dirname, 'public')));

  // Handle SPA routing - serve index.html for all routes
  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;

    try {
      // Always serve the index.html for client-side routing
      let template = path.resolve(__dirname, 'index.html');
      
      // Let Vite transform the index.html
      template = await vite.transformIndexHtml(url, template);
      
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      console.error(e);
      next(e);
    }
  });

  app.listen(PORT, () => {
    console.log(`Development server running at http://localhost:${PORT}`);
  });
}

createServer(); 