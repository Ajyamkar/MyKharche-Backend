const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  MONGO_URL: process.env.MONGO_URL,
  SECRET_KEY: process.env.SECRET,
  PORT: process.env.PORT,
};
