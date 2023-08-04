const express = require("express");
const { getDefaultIncomeCategories } = require("../controller/income");
const { verifyToken } = require("../Middlewares/Auth");
const router = express.Router();

router.get(
  "/getDefaultIncomeCategories",
  verifyToken,
  getDefaultIncomeCategories
);

module.exports = router;
