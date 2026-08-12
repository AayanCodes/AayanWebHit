const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from root directory
app.use(express.static(__dirname));

// Serve static files from images directory as well
app.use(express.static(path.join(__dirname, 'images')));

// Fallback to index.html for any html/page requests (not for missing files/images)
app.get('*', (req, res, next) => {
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'index.html'));
  } else {
    next();
  }
});

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;

