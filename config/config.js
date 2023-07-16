const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  MONGO_URL: process.env.MONGO_URL,
  SECRET_KEY: process.env.SECRET,
  PORT: process.env.PORT,
  FRONTEND_URL: process.env.FRONTEND_URL,
  GOOGLE_AUTH_PROMPT_URL: `${process.env.GOOGLE_AUTH_BASE_URL}?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_AUTH_REDIRECT_URL}&response_type=token&scope=${process.env.GOOGLE_AUTH_SCOPE}&state=${process.env.GOOGLE_AUTH_STATE}&prompt=consent`,
};
