const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const axios = require("axios");
const lists = require("./lists.js");
const PORT = process.env.PORT || 3000;

require("dotenv").config();

// Serve static files, including the favicon
app.use(express.static("public"));
app.use("/favicon.ico", express.static("images/favicon.ico"));

// Use bodyParser middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Render the html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/lists", (req, res) => {
  res.json({
    nouns: lists.nouns,
    adjectives: lists.adjectives,
  });
});

// https://ipgeolocation.io/documentation/timezone-api.html
app.post("/timeApi", async (req, res) => {
  const URL = `https://api.ipgeolocation.io/timezone?apiKey=${process.env.API_KEY}&location=${req.body.location}`;
  // this is an example of what is returned from the api
  const boston = {
    date: "2023-08-26",
    date_time: "2023-08-26 13:29:57",
    date_time_txt: "Saturday, August 26, 2023 13:29:57",
    date_time_unix: 1693070997.685,
    date_time_wti: "Sat, 26 Aug 2023 13:29:57 -0400",
    date_time_ymd: "2023-08-26T13:29:57-0400",
    dst_savings: 1,
    geo: {
      city: "Boston",
      country: "United States",
      latitude: 42.3554334,
      locality: "",
      location: "boston",
      longitude: -71.060511,
      state: "Massachusetts",
      // ... other properties of the geo object
    },
    is_dst: true,
    month: 8,
    time_12: "01:29:57 PM",
    time_24: "13:29:57",
    timezone: "America/New_York",
    timezone_offset: -5,
    timezone_offset_with_dst: -4,
    week: 34,
    year: 2023,
    year_abbr: "23",
  };

  res.json(boston);

  // try {
  //   const response = await axios.get(URL);
  //   res.json(response.data);
  // } catch (error) {
  //   console.error("Error:", error);
  // }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
