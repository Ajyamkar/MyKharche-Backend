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
      user.userExpenses.push({
        date: dateString,
        expenses: [addedExpense],
        totalExpenseAmount: amount,
      });
      await user.save();
    } else {
      // if expenses is already added for selected date then push the new expense to existing expenses.
      expenseForSelectedDate[0].expenses.push(addedExpense);
      expenseForSelectedDate[0].totalExpenseAmount += amount;
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

    const expenseForSelectedDate = req.user.userExpenses.filter(
      (expense) => expense.date === selectedDateToString
    );

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

    res.send({
      expenses: modifiedExpensesArr,
      totalExpenseAmount: expenseForSelectedDate[0].totalExpenseAmount,
    });
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

    let categoryObj;
    if (category) {
      const { categoryName, categoryType, _id: categoryId } = category;
      categoryObj = { _id: categoryId, categoryName, categoryType };
    } else {
      categoryObj = {
        _id: "64f9fa3db4bf5f12d42f8f0d",
        categoryName: "Deleted Category",
        categoryType: "Deleted Category",
      };
    }
    res.send({
      _id,
      amount,
      date,
      itemName,
      category: categoryObj,
    });
  } catch (error) {
    res.status(404).send("Something went wrong");
  }
};

const updateExpenseByExpenseId = async (req, res) => {
  const { expenseId } = req.params;
  const { editedData } = req.body;
  const { date, categoryId, amount } = editedData;
  const editedDateString = new Date(date).toDateString();

  try {
    editedData.date = editedDateString;
    const category = await expenseCategoryDB.findOne({
      _id: categoryId,
    });
    editedData.category = category;
    delete editedData.categoryId;
    console.log("editedData", editedData);

    const expenseBeforeUpdate = await userExpensesDB.findById(expenseId);
    const updatedExpense = await userExpensesDB.findByIdAndUpdate(
      expenseId,
      editedData,
      { new: true }
    );
    console.log("updatedExpense", updatedExpense);
    const user = await usersDB.findOne({ _id: req.user._id });

    // if date for an expense is edited then need to update totalExpenseAmount
    // for previous date and newly updated date
    if (expenseBeforeUpdate.date !== editedDateString) {
      // expenses of previous date
      const expensesofPreviosExpenseDate = await userExpensesDB
        .find({
          date: expenseBeforeUpdate.date,
        })
        .populate("category");
      const filteredExpensesForPreviousDate =
        expensesofPreviosExpenseDate.filter(
          (expense) => expense._id !== expenseBeforeUpdate._id
        );
      const userExpensesofPreviousExpenseDate = user.userExpenses.filter(
        (expense) => expense.date === expenseBeforeUpdate.date
      );
      userExpensesofPreviousExpenseDate[0].expenses =
        filteredExpensesForPreviousDate;
      userExpensesofPreviousExpenseDate[0].totalExpenseAmount -=
        expenseBeforeUpdate.amount;

      // expenses of selected date
      const userExpensesofSelectedExpenseDate = user.userExpenses.filter(
        (expense) => expense.date === editedDateString
      );
      if (!userExpensesofSelectedExpenseDate.length) {
        user.userExpenses.push({
          date: editedDateString,
          expenses: [updatedExpense],
          totalExpenseAmount: amount,
        });
      } else {
        userExpensesofSelectedExpenseDate[0].expenses.push(updatedExpense);
        userExpensesofSelectedExpenseDate[0].totalExpenseAmount += amount;
      }
      await user.save();
    }
    // if amount of an expense is edited then need to update
    // totalExpenseAmount for a particular date
    else if (expenseBeforeUpdate.amount !== amount) {
      const userExpensesofSelectedExpenseDate = user.userExpenses.filter(
        (expense) => expense.date === updatedExpense.date
      );
      userExpensesofSelectedExpenseDate[0].totalExpenseAmount +=
        amount - expenseBeforeUpdate.amount;
      await user.save();
    }

    res.send("Successfully edited the expense");
  } catch (error) {
    console.log(error);
    res.status(403).send(error);
  }
};

const deleteExpenseByExpenseId = async (req, res) => {
  const { expenseId } = req.params;

  try {
    const deletedExpense = await userExpensesDB.findByIdAndDelete(expenseId);
    const user = await usersDB.findOne({ _id: req.user._id });
    const expensesofDeletedExpenseDate = await userExpensesDB
      .find({ date: deletedExpense.date })
      .populate("category");

    const userExpensesofDeletedExpenseDate = user.userExpenses.filter(
      (expense) => expense.date === deletedExpense.date
    );
    // remove the deleted expense from expense array of userDB
    const filteredExpenses = expensesofDeletedExpenseDate.filter(
      (expense) => expense._id !== expenseId
    );

    userExpensesofDeletedExpenseDate[0].expenses = filteredExpenses;
    userExpensesofDeletedExpenseDate[0].totalExpenseAmount -=
      deletedExpense.amount;
    user.save();

    res.send("Successfully deleted an expense");
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
  deleteExpenseByExpenseId,
};
