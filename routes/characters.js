const express = require("express");
const router = express.Router();
const axios = require("../config/api-axios");

// Get a list of characters
router.get("/characters", async (req, res) => {
  try {
    console.log("Route: /characters");
    const skip = (req.query.page - 1) * 100; // limit <=> between 1 and 100
    // search a character by name <=> req.query.name
    console.log(req.query.page);
    console.log(skip);

    const response = await axios.get(
      `/characters?apiKey=${process.env.API_SECRET_MARVEL}&skip=${skip}&name=${req.query.name}`
    );
    console.log(response.data);

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
