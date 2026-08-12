const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve static files from root directory
app.use(express.static(__dirname));

// Serve static files from images directory as well, so both "/images/logo.png" and "/logo.png" work
app.use(express.static(path.join(__dirname, 'images')));

// Fallback to index.html for any other requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
