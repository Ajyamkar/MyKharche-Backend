const { usersDB } = require("../config/db");
const { generateToken } = require("../utils");

const loginUser = (req, res) => {
  res.send({
    message: "LoggedIn successfully",
    token: generateToken(req.user._id, true),
  });
};

const signupUser = async (req, res) => {
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
};

const updateUserPassword = async (req, res) => {
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
};

const checkUserIsLoggedIn = (req, res) => {
  res.send("User is loggedin.");
};

module.exports = {
  loginUser,
  signupUser,
  updateUserPassword,
  checkUserIsLoggedIn,
};
