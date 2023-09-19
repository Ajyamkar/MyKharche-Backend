const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  google_id: String,
  profilePicture: String,
  userExpenses: [
    {
      date: String,
      expenses: [
        {
          type: Schema.Types.ObjectId,
          ref: "userExpenses",
        },
      ],
      totalExpenseAmount: Number,
    },
  ],
  userIncome: [
    {
      month: String,
      year: Number,
      incomes: [
        {
          type: Schema.Types.ObjectId,
          ref: "userIncome",
        },
      ],
      totalIncomeForMonth: Number,
    },
  ],
  expenseCategories: [
    {
      type: Schema.Types.ObjectId,
      ref: "userExpenseCategory",
    },
  ],
});

module.exports = mongoose.model("users", userSchema);
