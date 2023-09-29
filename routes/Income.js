const express = require("express");
const {
  getDefaultIncomeCategories,
  saveIncome,
  getIncomeForSelectedMonth,
  deleteIncome,
  getIncomeById,
  editIncomeById,
} = require("../controller/income");
const { verifyToken } = require("../middlewares/Auth");
const router = express.Router();

router.get(
  "/getDefaultIncomeCategories",
  verifyToken,
  getDefaultIncomeCategories
);

router.post("/addNewIncome", verifyToken, saveIncome);

router.get(
  "/getIncome/month/:selectedMonth/year/:year",
  verifyToken,
  getIncomeForSelectedMonth
);

router.delete("/deleteIncome/:selectedId", verifyToken, deleteIncome);

router.get("/getIncome/:incomeId", verifyToken, getIncomeById);

router.put("/editIncome/:incomeId", verifyToken, editIncomeById);

module.exports = router;
