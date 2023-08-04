const { INCOME_CATEGORIES } = require("../constants");

const getDefaultIncomeCategories = async (req, res) => {
  res.send({ list: INCOME_CATEGORIES });
};

module.exports = {
  getDefaultIncomeCategories,
};
