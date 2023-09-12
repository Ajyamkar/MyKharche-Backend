const mongoose = require("mongoose");
const user = require("../models/user");
const expenseCategory = require("../models/expenseCategory");
const { MONGO_URL } = require("./config");
const expenses = require("../models/expenses");
const incomes = require("../models/incomes");

const usersDB = user;
const userExpensesDB = expenses;
const expenseCategoryDB = expenseCategory;
const userIncomeDB = incomes;

const connectDatabase = () => {
  mongoose
    .connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to database");
    });
};

module.exports = {
  usersDB,
  userExpensesDB,
  expenseCategoryDB,
  userIncomeDB,
  connectDatabase,
};
