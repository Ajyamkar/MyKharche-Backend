const express = require("express");
const {
  getDefaultIncomeCategories,
  saveIncome,
} = require("../controller/income");
const { verifyToken } = require("../middlewares/Auth");
const router = express.Router();

router.get(
  "/getDefaultIncomeCategories",
  verifyToken,
  getDefaultIncomeCategories
);

router.post("/addedNewIncome", verifyToken, saveIncome);

module.exports = router;
