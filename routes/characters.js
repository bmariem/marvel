const express = require("express");
const router = express.Router();
const axios = require("../config/api-axios");

// Get a list of characters
router.get("/characters", async (req, res) => {
  try {
    console.log("Route: /characters");

    const response = await axios.get(
      `/characters?apiKey=${process.env.API_SECRET_MARVEL}`
    );
    console.log(response.data);

    let url = `/characters?apiKey=${process.env.API_SECRET_MARVEL}`;

    if (req.query.name) {
      // search a characters by name <=> req.query.name
      url = `${url}&name=${req.query.name}`;
    }

    if (req.query.page) {
      const skip = (req.query.page - 1) * 100; // limit <=> between 1 and 100
      url = `${url}&skip=${skip}`;
    }

    res.status(200).json(response.data);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

// Get a the infos of a specific character
router.get("/character/:characterId", async (req, res) => {
  try {
    console.log("Route: /character/:characterId");

    // search a character by id
    console.log(req.params.characterId);

    const response = await axios.get(
      `/character/${req.params.characterId}?apiKey=${process.env.API_SECRET_MARVEL}`
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
