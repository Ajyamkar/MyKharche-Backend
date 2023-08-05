const mongoose = require("mongoose");
const { Schema } = mongoose;

const expenseSchema = Schema({
  date: String,
  itemName: String,
  amount: Number,
  category: {
    type: Schema.Types.ObjectId,
    ref: "userExpenseCategory",
  },
  user_id: Schema.Types.ObjectId,
});

module.exports = mongoose.model("userExpenses", expenseSchema);
