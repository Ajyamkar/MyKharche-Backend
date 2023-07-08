const express = require("express");
const cors = require("cors");
const { userAuthentication, verifyToken } = require("./Middlewares/Auth");
const { connectDatabase, usersDB } = require("./config/db");
const { generateToken } = require("./utils");
const { PORT, FRONTEND_URL } = require("./config/config");

const app = express();

app.use(express.json());
app.use(cors({ credentials: true, origin: FRONTEND_URL }));
connectDatabase();

app.post("/api/login", userAuthentication, (req, res) => {
  res.send({
    message: "LoggedIn successfully",
    token: generateToken(req.user._id),
  });
});

app.post("/api/signup", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  if (!email || !password || !firstName || !lastName) {
    res.status(422).send("Some fields values are missing.");
    return;
  }
  const user = await usersDB.findOne({ email });
  if (user) {
    res.status(422).send("User already exists.");
    return;
  }
  try {
    const newUser = await usersDB({ ...req.body }).save();
    res.send({
      message: "Created user successfully.",
      token: generateToken(newUser._id),
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put("/api/updatePassword", async (req, res) => {
  const { email, updatedPassword } = req.body;
  if (!email || !updatedPassword) {
    res.status(422).send("Some fields are missing.");
    return;
  }
  const foundUser = await usersDB.findOneAndUpdate(
    { email },
    { password: updatedPassword }
  );
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

app.get("/api/isUserLoggedIn", verifyToken, (req, res) => {
  res.send("User is loggedin.");
});

app.get("/api/dashboard", verifyToken, (req, res) => {
  res.send({ message: "Dashboard", user: req.user });
});

app.get("/", (req, res) => {
  res.send("Welcome to Mykharche backend");
});

app.listen(PORT, () => {
  console.log("server is running at port: " + PORT);
});
