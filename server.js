const express = require('express');
const app = express();
const port = 3000; // Choose any port you prefer

// Serve static files (HTML, CSS, JavaScript, and data file) from the project directory
app.use(express.static(__dirname));

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
