const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("./config/config");
const { expenseCategoryDB } = require("./config/db");
const { DEFAULT_EXPENSE_CATEGORIES } = require("./constants");

const verifyJwtToken = async (token) => {
  return await jwt.verify(token, SECRET_KEY);
};

const generateToken = (_id, forLongerDuration = false) => {
  return jwt.sign({ _id }, SECRET_KEY, {
    expiresIn: forLongerDuration ? `${24 * 5}hr` : "24hr",
  });
};

/**
 * To add default expense categories for newly created user.
 * @param user - newly created User Object
 */
const createDefaultExpenseCategories = (user) => {
  const createdDefaultCategories = DEFAULT_EXPENSE_CATEGORIES.map(
    async (category) => {
      const { categoryName, categoryType } = category;
      const newCategory = await expenseCategoryDB({
        user_id: user.id,
        categoryName,
        categoryType,
      }).save();
      return newCategory;
    }
  );
  Promise.all(createdDefaultCategories).then((defaultExpenseCategories) => {
    user.expenseCategories.push(...defaultExpenseCategories);
    user.save();
  });
};

module.exports = {
  verifyJwtToken,
  generateToken,
  createDefaultExpenseCategories,
};
