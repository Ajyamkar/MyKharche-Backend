const { userIncomeDB, usersDB } = require("../config/db");
const { INCOME_CATEGORIES } = require("../constants");

const getDefaultIncomeCategories = async (req, res) => {
  res.send({ list: INCOME_CATEGORIES });
};

const saveIncome = async (req, res) => {
  const { date, amount, categoryId } = req.body;

  try {
    const { categoryName: category } = INCOME_CATEGORIES.find(
      (incomeCategory) => incomeCategory.id === categoryId
    );
    // extract month in word from the selected date.
    const month = new Date(date).toLocaleString("default", { month: "long" });
    const dateString = new Date(date).toDateString();

    const addedIncome = await userIncomeDB({
      date: dateString,
      amount,
      source: {
        id: categoryId,
        category,
      },
      user_id: req.user._id,
    }).save();

    const user = await usersDB.findById(req.user._id);
    const foundIncomeForSelectedMonth = user.userIncome.find(
      (income) => income.month === month
    );

    if (foundIncomeForSelectedMonth) {
      foundIncomeForSelectedMonth.incomes.push(addedIncome);
    } else {
      user.userIncome.push({
        month,
        incomes: [addedIncome],
      });
    }

    await user.save();
    res.send("Successfully saved your income");
  } catch (error) {
    res.status(403).send(error);
  }
};

module.exports = {
  getDefaultIncomeCategories,
  saveIncome,
};
