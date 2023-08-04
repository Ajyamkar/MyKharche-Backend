const mongoose = require("mongoose");
const { usersDB, expenseCategoryDB } = require("../config/db");

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
    user.expenseCategory.push(userExpenseCategory);
    user.save();
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
      .populate("expenseCategory");
    const userExpenseCategories = user.expenseCategory.filter((category) => {
      return (
        category._id.toString() !==
        new mongoose.Types.ObjectId(expenseCategoryId).toString()
      );
    });

    user.expenseCategory = userExpenseCategories;
    user.save();

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

module.exports = {
  getUserExpenseCategories,
  addExpenseCategory,
  deleteExpenseCategory,
};
