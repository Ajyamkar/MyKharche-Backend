const express = require("express");
const {
  getDefaultIncomeCategories,
  saveIncome,
  getIncomeForSelectedMonth,
} = require("../controller/income");
const { verifyToken } = require("../middlewares/Auth");
const router = express.Router();

router.get(
  "/getDefaultIncomeCategories",
  verifyToken,
  getDefaultIncomeCategories
);

router.post("/addNewIncome", verifyToken, saveIncome);

router.get("/getIncome/:selectedMonth", verifyToken, getIncomeForSelectedMonth);

module.exports = router;
