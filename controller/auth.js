const { default: axios } = require("axios");
const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  GOOGLE_AUTH_PROMPT_URL,
} = require("../config/config");
const { usersDB } = require("../config/db");
const { generateToken, createDefaultExpenseCategories } = require("../utils");

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
    res
      .status(422)
      .send("User already exists. Redirecting to login, Try to login.");
    return;
  }
  try {
    const newUser = await usersDB({ ...req.body }).save();
    createDefaultExpenseCategories(newUser);
    res.send({
      message: "Account created successfully",
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
    res
      .status(404)
      .send("User not found. Redirecting to signup, Try to signup");
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

/**
 * Function used to login & signup with google.
 *
 * It requires {code} - returned by the google server &
 * {forLogin} - indicates to perform authentication for google login
 *
 * It fetches accessToken from the googleApi & with the help of accessToken user info is obtained.
 *
 * For loggingIn - From the obtained user info checks whether user googleId is present in database
 *
 * For signingUp - If no user is found then the user's googleId is stored with firstname & lastname
 */
const authenticateUserWithGoogle = async (req, res) => {
  const { code, forLogin } = req.body;
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

    const user = await usersDB.findOne({ google_id });

    // For login flow
    if (forLogin) {
      if (user) {
        res.send({
          message: "LoggedIn successfully",
          token: generateToken(user._id),
        });
        return;
      } else {
        res
          .status(404)
          .send(
            "User not found. Redirecting to signup. Try signing up with Google"
          );
        return;
      }
    }

    // From here signing up flow begins
    if (user) {
      res
        .status(422)
        .send("User already exists. Redirecting to login, Try to login.");
      return;
    }

    const newUser = await usersDB(userData).save();
    createDefaultExpenseCategories(newUser);
    res.send({
      message: "Account created successfully",
      token: generateToken(newUser._id),
    });
  } catch (error) {
    res
      .status(401)
      .send(
        error.response?.data?.error === "invalid_grant"
          ? "Token expired"
          : "Something went wrong"
      );
  }
};

module.exports = {
  googleAuthUrl,
  loginUser,
  signupUser,
  updateUserPassword,
  checkUserIsLoggedIn,
  authenticateUserWithGoogle,
};
