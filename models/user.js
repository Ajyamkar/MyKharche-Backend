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
      expense: [
        {
          type: Schema.Types.ObjectId,
          ref: "userExpenses",
        },
      ],
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
