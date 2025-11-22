// server.js
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Folder where Webpack outputs everything
const DIST = path.join(__dirname, 'dist');

// Serve all built static files (HTML, CSS, JS, images)
app.use(express.static(DIST, { extensions: ['html'] }));
app.use(express.json());

// ----------------------------
// ROUTES
// ----------------------------

// Root ("Home") page
app.get('/', (_req, res) => {
  res.sendFile(path.join(DIST, 'index.html'));
});

// Allow direct navigation to these pages
app.get(['/Projects.html', '/Resume.html', '/Contact.html'], (req, res) => {
  res.sendFile(path.join(DIST, req.path));
});

// API endpoint: reads the built projects.json from /dist
app.get('/api/projects', (_req, res) => {
  const filePath = path.join(DIST, 'projects.json');

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Project data not found' });
  }

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Could not load project data' });
    }

    try {
      res.json(JSON.parse(data));
    } catch {
      res.status(500).json({ error: 'Malformed JSON in project data' });
    }
  });
});

// Fallback 404
app.use((_req, res) => {
  res.status(404).send('Page not found');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Portfolio running at http://localhost:${PORT}`);
});
