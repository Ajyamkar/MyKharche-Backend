const express = require("express");
const {
  getUserExpenseCategories,
  addExpenseCategory,
  deleteExpenseCategory,
  addExpense,
  getUserExpensesForSelectedDate,
} = require("../controller/expenses");
const { verifyToken } = require("../Middlewares/Auth");

const router = express.Router();

router.post("/addExpense", verifyToken, addExpense);

router.get("/getUserExpenseCategories", verifyToken, getUserExpenseCategories);

router.post("/addExpenseCategory", verifyToken, addExpenseCategory);

router.delete("/deleteExpenseCategory", verifyToken, deleteExpenseCategory);

router.get(
  "/getUserExpensesForSelectedDate/:selectedDate",
  verifyToken,
  getUserExpensesForSelectedDate
);

module.exports = router;
