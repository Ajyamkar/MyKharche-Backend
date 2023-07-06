const express = require("express");

const app = express();
const PORT = 3001;
const users = [];

app.use(express.json());

const userAuthentication = (req, res, next) => {
  let foundUser;
  let errorStatus = 404;
  let errorText = "User not found";
  const { email, password } = req.body;

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

app.post("/login", userAuthentication, (req, res) => {
  console.log("req.user", req.user);
  res.send("LoggedIn successfully");
});

app.post("/signup", (req, res) => {
  const user = users.find((user) => {
    return user.email === req.body.email;
  });
  if (user) {
    res.status(422).send("user already exists.");
    return;
  }
  users.push({ id: Date.now(), ...req.body });
  res.send("User is created successfully.");
});

app.get("/users", (req, res) => {
  res.json(users);
});

app.get("/", (req, res) => {
  res.send("sucessfully created repo.");
});

app.listen(PORT, () => {
  console.log("server is running at port: " + PORT);
});
