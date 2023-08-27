const express = require("express");
const {
  getUserExpenseCategories,
  addExpenseCategory,
  deleteExpenseCategory,
  addExpense,
  getUserExpensesForSelectedDate,
  getExpenseById,
  updateExpenseByExpenseId,
} = require("../controller/expenses");
const { verifyToken } = require("../Middlewares/Auth");

const router = express.Router();

router.post("/addExpense", verifyToken, addExpense);

router.get("/getExpenseById/:expenseId", verifyToken, getExpenseById);

router.get("/getUserExpenseCategories", verifyToken, getUserExpenseCategories);

router.post("/addExpenseCategory", verifyToken, addExpenseCategory);

router.delete("/deleteExpenseCategory", verifyToken, deleteExpenseCategory);

router.get(
  "/getUserExpensesForSelectedDate/:selectedDate",
  verifyToken,
  getUserExpensesForSelectedDate
);

router.put(
  "/updateExpenseByExpenseId/:expenseId",
  verifyToken,
  updateExpenseByExpenseId
);

module.exports = router;
