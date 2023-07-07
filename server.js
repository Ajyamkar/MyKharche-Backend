const express = require("express");
const {
  secret,
  users,
  userAuthentication,
  verifyToken,
} = require("./Middlewares/Auth");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 3001;

app.use(express.json());

const generateToken = (_id) => {
  return jwt.sign({ _id }, secret);
};

app.post("/login", userAuthentication, (req, res) => {
  res.send({
    message: "LoggedIn successfully",
    token: generateToken(req.user._id),
  });
});

app.post("/signup", (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  if (!email || !password || !firstName || !lastName) {
    res.status(422).send("Some fields values are missing.");
    return;
  }
  const user = users.find((user) => {
    return user.email === email;
  });
  if (user) {
    res.status(422).send("user already exists.");
    return;
  }
  const _id = Date.now();
  users.push({ _id, ...req.body });
  res.send({
    message: "Created user successfully.",
    token: generateToken(_id),
  });
});

app.put("/updatePassword", (req, res) => {
  const { email, updatedPassword } = req.body;
  if (!email || !updatedPassword) {
    res.status(422).send("Some fields are missing.");
    return;
  }
  const foundUser = users.find((user) => user.email === email);
  if (!foundUser) {
    res.status(404).send("User not found");
  } else {
    foundUser.password = updatedPassword;
    res.send({
      message: "Successfully updated the password.",
      token: generateToken(foundUser._id),
    });
  }
});

app.get("/users", (req, res) => {
  res.json(users);
});

app.get("/", (req, res) => {
  res.send("sucessfully created repo.");
});

app.get("/dashboard", verifyToken, (req, res) => {
  res.send({ message: "Dashboard", user: req.user });
});

app.listen(PORT, () => {
  console.log("server is running at port: " + PORT);
});
