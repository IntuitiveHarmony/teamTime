const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const axios = require("axios");
const PORT = 3000;

require("dotenv").config();

// Serve static files, including the favicon
app.use(express.static("public"));
app.use("/favicon.ico", express.static("images/favicon.ico"));
// app.use(express.static(path.join(__dirname, "public")));
// Serve the favicon only when requested
// app.get("/favicon.ico", (req, res) => {
//   res.sendFile(path.join(__dirname, "favicon.ico"));
// });

// Use bodyParser middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Render the html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// https://ipgeolocation.io/documentation/timezone-api.html
app.post("/timeApi", async (req, res) => {
  const URL = `https://api.ipgeolocation.io/timezone?apiKey=${process.env.API_KEY}&location=${req.body.location}`;

  try {
    const response = await axios.get(URL);
    res.json(response.data);
  } catch (error) {
    console.error("Error:", error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
