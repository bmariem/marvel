const express = require("express");
const router = express.Router();
const axios = require("../config/api-axios");

const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

// import models
const User = require("../models/User");

// import middleware
const isAuthenticated = require("../middleware/isAuthenticated");

// user/signup
router.post("/user/signup", async (req, res) => {
  try {
    const { email, username, password } = req.fields;
    const user = await User.findOne({ email: email });
    if (user) {
      // email exists <=> account already exists
      res.status(409).json({
        message: "This email already has an account",
      });
    } else {
      // email does not exists <=> create an account
      if (email && username && password) {
        const salt = uid2(16); // generate a Salt
        const hash = SHA256(password + salt).toString(encBase64); // generate an HASH
        const token = uid2(16); // generate a token

        const newUser = new User({
          email,
          username,
          token,
          hash,
          salt,
        });

        await newUser.save();
        res.status(200).json({
          _id: newUser._id,
          email: newUser.email,
          username: newUser.username,
          token: newUser.token,
        });
      } else {
        res.status(400).json({
          message: "Missing parameters",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error.message,
    });
  }
});

// user/login
router.post("/user/login", async (req, res) => {
  try {
    const { password, email } = req.fields;

    const user = await User.findOne({ email });
    if (user === null) {
      // email exist <=> no user in DB found
      res.status(400).json({
        message: "No account registered with this email !",
      });
    } else {
      // email exist <=> user exists in BDD
      const newHash = SHA256(password + user.salt).toString(encBase64);
      // check password
      if (user.hash === newHash) {
        // Authorized access <=> we can connect
        res.status(200).json({
          _id: user._id,
          account: user.account,
          token: user.token,
        });
      } else {
        //Unauthorized
        res.status(401).json({
          message: "Unauthorized",
        });
      }
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// user/favorites
router.get("/user/favorites", isAuthenticated, async (req, res) => {
  try {
    res.status(200).json({
      id: req.user._id,
      email: req.user.email,
      username: req.user.username,
      token: req.user.token,
      favorites: {
        favoriteCharacters: req.user.favorites.favoriteCharacters,
        favoriteComics: req.user.favorites.favoriteComics,
      },
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

const addFavoriteCharacter = (user, character) => {
  if (user.favorites === undefined) {
    user.favorites = {
      favoriteCharacters: [],
      favoriteComics: [],
    };
  }
  // check if character already exists in favorites
  let exist = user.favorites.favoriteCharacters.find((element) => {
    return element._id === character._id;
  });

  // character does not exists in favorites <=> add it
  if (!exist) {
    user.favorites.favoriteCharacters.push(character);
  }
};

const addFavoriteComic = (user, comic) => {
  if (user.favorites === undefined) {
    user.favorites = {
      favoriteCharacters: [],
      favoriteComics: [],
    };
  }

  // check if comic already exists in favorites
  let exist = user.favorites.favoriteComics.find((element) => {
    return element._id === comic._id;
  });

  // if not <=> add it
  if (!exist) {
    user.favorites.favoriteComics.push(comic);
  }
};

router.post("/user/favorites", isAuthenticated, async (req, res) => {
  try {
    const favoriteId = req.fields.id;

    const favoriteType = req.fields.type;

    const user = await User.findById(req.user.id); // Checking if user ID is already in my bdd

    if (favoriteType === "character") {
      const response = await axios.get(
        `/character/${favoriteId}?apiKey=${process.env.API_SECRET_MARVEL}`
      );

      addFavoriteCharacter(user, response.data);
    } else if (favoriteType === "comic") {
      const response = await axios.get(
        `/comic/${favoriteId}?apiKey=${process.env.API_SECRET_MARVEL}`
      );
      addFavoriteComic(user, response.data);
    }

    await user.save();

    res.status(200).json(req.user);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

module.exports = router;
