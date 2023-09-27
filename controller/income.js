const { default: mongoose } = require("mongoose");
const { userIncomeDB, usersDB } = require("../config/db");
const { INCOME_CATEGORIES } = require("../constants");

const getDefaultIncomeCategories = async (req, res) => {
  res.send({ list: INCOME_CATEGORIES });
};

const saveIncome = async (req, res) => {
  let { date, amount, categoryId } = req.body;
  date = new Date(date);

  try {
    const { categoryName: category } = INCOME_CATEGORIES.find(
      (incomeCategory) => incomeCategory.id === categoryId
    );
    // extract month in word from the selected date.
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    const dateString = date.toDateString();

    const addedIncome = await userIncomeDB({
      date: dateString,
      month,
      year,
      amount,
      source: {
        id: categoryId,
        category,
      },
      user_id: req.user._id,
    }).save();

    const user = await usersDB.findById(req.user._id);
    const foundIncomeForSelectedMonth = user.userIncome.find(
      (income) => income.month === month && income.year === year
    );

    if (foundIncomeForSelectedMonth) {
      foundIncomeForSelectedMonth.incomes.push(addedIncome);
      foundIncomeForSelectedMonth.totalIncomeForMonth += amount;
    } else {
      user.userIncome.push({
        month,
        year,
        incomes: [addedIncome],
        totalIncomeForMonth: amount,
      });
    }

    await user.save();
    res.send("Successfully saved your income");
  } catch (error) {
    res.status(403).send(error);
  }
};

const getIncomeForSelectedMonth = async (req, res) => {
  const { selectedMonth: month, year } = req.params;
  try {
    const incomesForSelectedMonth = await userIncomeDB.find({
      month,
      year,
      user_id: req.user._id,
    });
    const foundIncome = req.user.userIncome.find(
      (income) => income.month === month && income.year === Number(year)
    );

    res.send({
      incomesForSelectedMonth,
      selectedMonth: month,
      totalIncomeForMonth: foundIncome.totalIncomeForMonth,
    });
  } catch (error) {
    res.status(404).send(error);
  }
};

const deleteIncome = async (req, res) => {
  const { selectedId } = req.params;

  try {
    const deletedIncome = await userIncomeDB.findByIdAndDelete(selectedId);

    const currentUser = await usersDB
      .findById(req.user._id)
      .populate("userIncome");

    const incomesForSelectedMonth = currentUser.userIncome.find(
      (income) =>
        income.month === deletedIncome.month &&
        income.year === deletedIncome.year
    );

    const filteredIncomes = incomesForSelectedMonth.incomes.filter(
      (incomeId) => incomeId !== new mongoose.Types.ObjectId(selectedId)
    );

    incomesForSelectedMonth.incomes = filteredIncomes;
    incomesForSelectedMonth.totalIncomeForMonth -= deletedIncome.amount;

    currentUser.save();

    res.send("successfully deleted the income");
  } catch (error) {
    res.status(404).send(error);
  }
};

const getIncomeById = async (req, res) => {
  const { incomeId } = req.params;

  try {
    const income = await userIncomeDB.findById(incomeId);
    res.send(income);
  } catch (error) {
    res.status(404).send(error);
  }
};

module.exports = {
  getDefaultIncomeCategories,
  saveIncome,
  getIncomeForSelectedMonth,
  deleteIncome,
  getIncomeById,
};
