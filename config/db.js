const mongoose = require("mongoose");
const user = require("../models/user");
const { MONGO_URL } = require("./config");

const usersDB = user;

const connectDatabase = () => {
  mongoose
    .connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to database");
    });
};

module.exports = { usersDB, connectDatabase };
