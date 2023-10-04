'use strict';
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('src')) // Static files from public directory
app.use(express.json()) // For parsing application/json

// Start server
app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});