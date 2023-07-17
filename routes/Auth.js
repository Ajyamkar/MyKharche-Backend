const express = require("express");
const {
  loginUser,
  signupUser,
  updateUserPassword,
  checkUserIsLoggedIn,
  signUpUserWithGoogle,
  googleAuthUrl,
} = require("../controller/auth");
const { userAuthentication, verifyToken } = require("../Middlewares/Auth");
const router = express.Router();

router.use(express.json());

router.get("/getGoogleAuthUrl", googleAuthUrl);

router.post("/login", userAuthentication, loginUser);

router.post("/signup", signupUser);

router.put("/updatePassword", updateUserPassword);

router.get("/isUserLoggedIn", verifyToken, checkUserIsLoggedIn);

router.post("/googleSignUp", signUpUserWithGoogle);

module.exports = router;
