
// IMPORTANT: you must run `npm install` in the directory for this assignment
// to install the mime library if you're testing this on your local machine.
// However, Glitch will install it automatically by looking in your package.json
// file.

const express = require("express");

const app = express();

app.use(express.static("public"));

app.listen(process.env.PORT || 3000, () => {
  console.log("Server successfully started at http://localhost:3000");
})