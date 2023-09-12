const { userIncomeDB } = require("../config/db");
const { INCOME_CATEGORIES } = require("../constants");

const getDefaultIncomeCategories = async (req, res) => {
  res.send({ list: INCOME_CATEGORIES });
};

const saveIncome = async (req, res) => {
  const { date, amount, categoryId, category } = req.body;

  try {
    const month = new Date(date).toLocaleString("default", { month: "long" });
    const dateString = new Date(date).toDateString();

    const addedIncome = await userIncomeDB({
      date: dateString,
      amount,
      source: {
        id: categoryId,
        category,
      },
    });

    res.send(addedIncome);
  } catch (error) {}
};

module.exports = {
  getDefaultIncomeCategories,
  saveIncome,
};
