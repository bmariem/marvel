// Enable ENV vars <=> have access to process.env
require("dotenv").config();

const express = require("express");
const formidable = require("express-formidable");

const cors = require("cors");

// create a server
const app = express();
app.use(formidable());

// Allow requests between my AMI and other external sites
app.use(cors());

app.get("/", async (req, res) => {
  res.status(200).json("Welcome on Marvel API !");
});

//import routes
const comicsRoutes = require("./routes/comics");
app.use(comicsRoutes);

const charactersRoutes = require("./routes/characters");
app.use(charactersRoutes);

app.all("*", (req, res) => {
  res.status(404).json("Page not found !");
});

app.listen(process.env.PORT, () => {
  console.log("Server has started 🚀");
});
