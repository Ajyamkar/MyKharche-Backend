const dotenv = require("dotenv");
dotenv.config();

const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_AUTH_CLIENT_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_AUTH_REDIRECT_URL;

module.exports = {
  MONGO_URL: process.env.MONGO_URL,
  SECRET_KEY: process.env.SECRET,
  PORT: process.env.PORT,
  FRONTEND_URL: process.env.FRONTEND_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  GOOGLE_AUTH_PROMPT_URL: `${process.env.GOOGLE_AUTH_BASE_URL}?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_AUTH_REDIRECT_URL}&response_type=code&scope=${process.env.GOOGLE_AUTH_SCOPE}&state=${process.env.GOOGLE_AUTH_STATE}&prompt=consent`,
};
