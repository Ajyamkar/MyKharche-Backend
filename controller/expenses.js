const mongoose = require("mongoose");
const { usersDB, expenseCategoryDB, userExpensesDB } = require("../config/db");

const addExpense = async (req, res) => {
  const { _id: user_id } = req.user;
  const { date, itemName, amount, categoryId } = req.body;

  try {
    const dateString = new Date(date).toDateString();
    const category = await expenseCategoryDB.findOne({ _id: categoryId });

    // create expense
    const addedExpense = await userExpensesDB({
      date: dateString,
      itemName,
      amount,
      category,
      user_id,
    }).save();

    // search for the user
    const user = await usersDB.findOne({ _id: user_id });
    // filter out the expenseslist for the selected date.
    const expenseForSelectedDate = user.userExpenses.filter(
      (expense) => expense.date === dateString
    );

    if (!expenseForSelectedDate.length) {
      // if no expense for the selected data then push new expense for the selected date.
      user.userExpenses.push({ date: dateString, expense: [addedExpense] });
      await user.save();
    } else {
      // if expenses is already added for selected date then push the new expense to existing expenses.
      expenseForSelectedDate[0].expense.push(addedExpense);
      await user.save();
    }
    res.send("Successfully saved your expense.");
  } catch (error) {
    res.status(404).send("Something went wrong");
  }
};

const getUserExpenseCategories = async (req, res) => {
  const { _id } = req.user;
  try {
    const userExpenseCategories = await expenseCategoryDB.find({
      user_id: _id,
    });
    const modifiedExpenseCategories = userExpenseCategories.map((category) => {
      return {
        id: category._id,
        categoryName: category.categoryName,
        categoryType: category.categoryType,
      };
    });
    res.send(modifiedExpenseCategories);
  } catch (error) {
    res.send(401).send(error);
  }
};

const addExpenseCategory = async (req, res) => {
  const { categoryName, categoryType } = req.body;
  const { _id: user_id } = req.user;

  try {
    const userExpenseCategory = await expenseCategoryDB({
      categoryName,
      categoryType,
      user_id,
    }).save();

    const user = await usersDB.findOne({ _id: user_id });
    user.expenseCategories.push(userExpenseCategory);
    await user.save();

    res.send({
      message: "Successfully created new category",
      expenseCategoryId: userExpenseCategory._id,
    });
  } catch (error) {
    res.status(401).send(error);
  }
};

const deleteExpenseCategory = async (req, res) => {
  const { expenseCategoryId } = req.body;

  try {
    await expenseCategoryDB.findOneAndDelete({
      _id: expenseCategoryId,
    });

    const user = await usersDB
      .findOne({ _id: req.user._id })
      .populate("expenseCategories");
    const userExpenseCategories = user.expenseCategories.filter((category) => {
      return (
        category._id.toString() !==
        new mongoose.Types.ObjectId(expenseCategoryId).toString()
      );
    });

    user.expenseCategories = userExpenseCategories;
    await user.save();

    const list = userExpenseCategories.map((category) => {
      return {
        id: category._id,
        categoryName: category.categoryName,
        categoryType: category.categoryType,
      };
    });

    res.send({
      message: "Succesfully deleted the category",
      updatedCategoriesList: list,
    });
  } catch (error) {
    res.status(401).send(error);
  }
};

const getUserExpensesForSelectedDate = async (req, res) => {
  const { selectedDate } = req.params;
  try {
    const selectedDateToString = new Date(selectedDate)?.toDateString();

    const expensesForSelectedDate = await userExpensesDB
      .find({
        date: selectedDateToString,
        user_id: req.user._id,
      })
      .populate("category");

    const modifiedExpensesArr = expensesForSelectedDate.map((expense) => {
      const { _id, amount, date, itemName, category } = expense;
      return {
        _id,
        amount,
        date,
        itemName,
        category: {
          id: category?._id,
          categoryName: category?.categoryName,
          categoryType: category?.categoryType,
        },
      };
    });

    res.send(modifiedExpensesArr);
  } catch (error) {
    res.status(404).send(error);
  }
};

const getExpenseById = async (req, res) => {
  const { expenseId } = req.params;

  try {
    const expense = await userExpensesDB
      .findById(expenseId)
      .populate("category");

    if (!expense) {
      res.status(404).send("Invalid Expense ID");
      return;
    }
    const { _id, amount, date, itemName, category } = expense;
    const { categoryName, categoryType, _id: categoryId } = category;
    res.send({
      _id,
      amount,
      date,
      itemName,
      category: { _id: categoryId, categoryName, categoryType },
    });
  } catch (error) {
    res.status(404).send("Something went wrong");
  }
};

const updateExpenseByExpenseId = async (req, res) => {
  const { expenseId } = req.params;
  const { editedData } = req.body;
  const { date, categoryId } = editedData;

  try {
    if (date) {
      editedData.date = new Date(date).toDateString();
    }
    if (categoryId) {
      const category = await expenseCategoryDB.findOne({
        _id: categoryId,
      });
      editedData.category = category;
    }
    const updatedData = await userExpensesDB.findByIdAndUpdate(
      expenseId,
      editedData,
      { new: true }
    );
    res.send("Successfully edited the expense");
  } catch (error) {
    res.status(403).send(error);
  }
};

module.exports = {
  addExpense,
  getUserExpenseCategories,
  addExpenseCategory,
  deleteExpenseCategory,
  getUserExpensesForSelectedDate,
  getExpenseById,
  updateExpenseByExpenseId,
};
