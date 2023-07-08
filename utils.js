const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("./config/config");

const verifyJwtToken = async (token) => {
  return await jwt.verify(token, SECRET_KEY);
};

const generateToken = (_id) => {
  return jwt.sign({ _id }, SECRET_KEY, { expiresIn: "2hr" });
};

module.exports = { verifyJwtToken, generateToken };
