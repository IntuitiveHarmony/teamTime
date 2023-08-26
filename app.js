const express = require("express");
const app = express();
const path = require("path");
const PORT = 3000;

require("dotenv").config();
module.exports.apiKey = process.env.API_KEY;

// Serve static files, including the favicon
app.use(express.static(path.join(__dirname, "public")));
// Serve the favicon only when requested
app.get("/favicon.ico", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "favicon.ico"));
});

// Render the html
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
