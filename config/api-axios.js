const axios = require("axios");

const instance = axios.create({
  baseURL: "https://lereacteur-marvel-api.herokuapp.com", // API Marvel
});

module.exports = instance;
