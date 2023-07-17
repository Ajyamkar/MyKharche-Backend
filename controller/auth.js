const { default: axios } = require("axios");
const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  GOOGLE_AUTH_PROMPT_URL,
} = require("../config/config");
const { usersDB } = require("../config/db");
const { generateToken } = require("../utils");

const googleAuthUrl = (req, res) => {
  res.send(GOOGLE_AUTH_PROMPT_URL);
};

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

const signUpUserWithGoogle = async (req, res) => {
  const { code } = req.body;
  const url = `https://oauth2.googleapis.com/token?client_id=${GOOGLE_CLIENT_ID}&client_secret=${GOOGLE_CLIENT_SECRET}&code=${code}&redirect_uri=${GOOGLE_REDIRECT_URI}&grant_type=authorization_code`;
  try {
    const response = await axios.post(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    const {
      data: { access_token },
    } = response;

    const googleUserInfo = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`
    );
    const {
      id: google_id,
      given_name: firstName,
      family_name: lastName,
      email,
    } = googleUserInfo.data;
    const userData = {
      google_id,
      firstName,
      lastName,
      email,
    };

    const newUser = await usersDB(userData).save();
    res.send({
      message: "Created user successfully.",
      token: generateToken(newUser._id),
    });
  } catch (error) {
    res.status(401).send(error.response?.data);
  }
};

module.exports = {
  googleAuthUrl,
  loginUser,
  signupUser,
  updateUserPassword,
  checkUserIsLoggedIn,
  signUpUserWithGoogle,
};
