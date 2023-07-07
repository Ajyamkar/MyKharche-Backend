const jwt = require("jsonwebtoken");

const secret = "sfvj sfsvdsv svbsjvhjsdvsdb sbv";
const users = [];

const userAuthentication = (req, res, next) => {
  let foundUser;
  let errorStatus = 404;
  let errorText = "User not found";
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(422).send("Some fields values are missing.");
    return;
  }

  users.forEach((user) => {
    if (user.email === email) {
      if (user.password === password) {
        foundUser = user;
      } else {
        errorStatus = 401;
        errorText = "Incorrect password";
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

const verifyToken = (req, res, next) => {
  const { token } = req.headers;
  jwt.verify(token, secret, (err, currentUser) => {
    if (err) {
      res.status(403).send("Forbidden");
      return;
    }
    req.user = users.find((user) => user._id === currentUser._id);
    next();
  });
};

module.exports = { secret, users, userAuthentication, verifyToken };
