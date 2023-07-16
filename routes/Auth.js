const express = require("express");
const {
  loginUser,
  signupUser,
  updateUserPassword,
  checkUserIsLoggedIn,
} = require("../controller/auth");
const { userAuthentication, verifyToken } = require("../Middlewares/Auth");
const router = express.Router();

router.use(express.json());

router.post("/login", userAuthentication, loginUser);

router.post("/signup", signupUser);

router.put("/updatePassword", updateUserPassword);

router.get("/isUserLoggedIn", verifyToken, checkUserIsLoggedIn);

module.exports = router;
