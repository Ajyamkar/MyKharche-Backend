const mongoose = require("mongoose");
const { Schema } = mongoose;

const incomeSchema = Schema({
  date: String,
  amount: String,
  source: {
    id: String,
    category: String,
  },
});

module.exports = mongoose.model("userIncome", incomeSchema);
