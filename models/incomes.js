const mongoose = require("mongoose");
const { Schema } = mongoose;

const incomeSchema = Schema({
  date: String,
  month: String,
  amount: String,
  source: {
    id: String,
    category: String,
  },
  user_id: Schema.Types.ObjectId,
});

module.exports = mongoose.model("userIncome", incomeSchema);
