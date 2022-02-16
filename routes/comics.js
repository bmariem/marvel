const express = require("express");
const router = express.Router();
const axios = require("../config/api-axios");

// Get a list of comics
router.get("/comics", async (req, res) => {
  try {
    console.log("Route: /comics");

    let url = `/comics?apiKey=${process.env.API_SECRET_MARVEL}`;

    if (req.query.search) {
      // search a comic by title <=> req.query.search
      url = `${url}&title=${req.query.search}`;
    }

    if (req.query.page) {
      const skip = (req.query.page - 1) * 100; // limit <=> between 1 and 100
      url = `${url}&skip=${skip}`;
    }

    const response = await axios.get(url);
    console.log(response.data);

    res.status(200).json(response.data);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

// Get a comics by id
router.get("/comic/:id", async (req, res) => {
  try {
    console.log("Route: /comic/:id");

    // search a comic by id
    console.log(req.params.id);

    const response = await axios.get(
      `/comic/${req.params.id}?apiKey=${process.env.API_SECRET_MARVEL}`
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
