const express = require("express");
const router = express.Router();
const axios = require("../config/api-axios");

// Get a list of comics
router.get("/comics", async (req, res) => {
  try {
    console.log("Route: /comics");
    const skip = (req.query.page - 1) * 100; // limit <=> between 1 and 100
    // search a comic by title <=> req.query.search
    console.log(req.query.page);
    console.log(skip);

    const response = await axios.get(
      `/comics?apiKey=${process.env.API_SECRET_MARVEL}&skip=${skip}&title=${req.query.search}`
    );
    console.log(response.data);

    res.status(200).json(response.data);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

// Get a list of comics containing a specific character
router.get("/comics/:id", async (req, res) => {
  try {
    console.log("Route: /comics/:id");

    // search a comic by id
    console.log(req.params.id);

    const response = await axios.get(
      `/comics/${req.params.id}?apiKey=${process.env.API_SECRET_MARVEL}`
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
