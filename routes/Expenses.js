const express = require("express");
const {
  getUserExpenseCategories,
  addExpenseCategory,
  deleteExpenseCategory,
  addExpense,
} = require("../controller/expenses");
const { verifyToken } = require("../Middlewares/Auth");

const router = express.Router();

router.post("/addExpense", verifyToken, addExpense);

router.get("/getUserExpenseCategories", verifyToken, getUserExpenseCategories);

router.post("/addExpenseCategory", verifyToken, addExpenseCategory);

router.delete("/deleteExpenseCategory", verifyToken, deleteExpenseCategory);

module.exports = router;
