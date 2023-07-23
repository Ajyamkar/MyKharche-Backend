const { usersDB } = require("../config/db");
const { verifyJwtToken } = require("../utils");

const userAuthentication = async (req, res, next) => {
  let foundUser;
  let errorStatus = 404;
  let errorText = "User not found. Redirecting to signup, Try to signup";
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(422).send("Some fields values are missing.");
    return;
  }

  const usersArr = await usersDB.find({});
  usersArr.forEach((user) => {
    if (user.email === email) {
      if (user.password === password) {
        foundUser = user;
      } else {
        errorStatus = 401;
        errorText = "Incorrect password, Try again.";
      }
      return;
    }
  });

  if (foundUser) {
    req.user = foundUser;
    next();
  } else {
    res.status(errorStatus).send(errorText);
  }
};

const verifyToken = async (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization.split(" ")[1];
  try {
    const data = await verifyJwtToken(token);
    const currentUser = await usersDB.findOne({ _id: data._id });
    if (!currentUser) {
      res
        .status(404)
        .send("User not found. Redirecting to signup, Try to signup");
    } else {
      req.user = currentUser;
      next();
    }
  } catch (err) {
    res.status(403).send("Forbidden");
  }
};

module.exports = { userAuthentication, verifyToken };
