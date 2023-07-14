const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("./config/config");

const verifyJwtToken = async (token) => {
  return await jwt.verify(token, SECRET_KEY);
};

const generateToken = (_id, forLongerDuration = false) => {
  return jwt.sign({ _id }, SECRET_KEY, {
    expiresIn: forLongerDuration ? `${24 * 5}hr` : "24hr",
  });
};

module.exports = { verifyJwtToken, generateToken };
