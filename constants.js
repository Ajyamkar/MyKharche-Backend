/**
 * Default expense categories that will be added
 * when user's account is created
 */
const DEFAULT_EXPENSE_CATEGORIES = [
  { categoryName: "Grocery", categoryType: "Essentails" },
  { categoryName: "Electricity bill", categoryType: "Essentails" },
  { categoryName: "trek", categoryType: "Leisure" },
  { categoryName: "EMI", categoryType: "Loans" },
];

/**
 * Income categories for a user.
 * For now we have kept it static data
 */
const INCOME_CATEGORIES = [
  { id: "90sd15997696ed", categoryName: "Salary" },
  { id: "87cs39665178qw", categoryName: "Side Hustle" },
  { id: "28ef56985854aa", categoryName: "Gift" },
  { id: "17vf33031501uu", categoryName: "Pocket Money" },
  { id: "33po40745881vb", categoryName: "Other" },
];

module.exports = {
  DEFAULT_EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
};
