const express = require("express");
const cors = require("cors");
const { verifyToken } = require("./Middlewares/Auth");
const { connectDatabase, usersDB, expenseCategoryDB } = require("./config/db");
const { PORT, FRONTEND_URL } = require("./config/config");
const authRoute = require("./routes/Auth");
const mongoose = require("mongoose");
const { INCOME_CATEGORIES } = require("./constants");

const app = express();

app.use(express.json());
app.use(cors({ credentials: true, origin: FRONTEND_URL }));
connectDatabase();

// Routes
app.use("/api/auth", authRoute);

app.get("/api/dashboard", verifyToken, (req, res) => {
  res.send({ message: "Dashboard", user: req.user });
});

app.get("/", (req, res) => {
  res.send("Welcome to Mykharche backend");
});

app.get("/api/getDefaultIncomeCategories", verifyToken, async (req, res) => {
  res.send({ list: INCOME_CATEGORIES });
});

app.get("/api/getUserExpenseCategories", verifyToken, async (req, res) => {
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
});

app.post("/api/addExpenseCategory", verifyToken, async (req, res) => {
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
});

app.delete("/api/deleteExpenseCategory", verifyToken, async (req, res) => {
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
    res.send(error);
  }
});

app.listen(PORT, () => {
  console.log("server is running at port: " + PORT);
});
