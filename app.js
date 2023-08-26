const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const PORT = 3000;

require("dotenv").config();

// Serve static files, including the favicon
app.use(express.static(path.join(__dirname, "public")));
// Serve the favicon only when requested
app.get("/favicon.ico", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "favicon.ico"));
});

// Use bodyParser middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Render the html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/timeApi", (req, res) => {
  const URL = `https://api.ipgeolocation.io/timezone?apiKey=${process.env.API_KEY}&location=${req.body.location}`;
  console.log(URL);

  // res.json({ message: "Request received", location: location });
  // console.log(res);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
