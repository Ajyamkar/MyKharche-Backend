const mongoose = require("mongoose");
const { Schema } = mongoose;

const expenseCategorySchema = Schema({
  categoryName: String,
  categoryType: String,
  user_id: Schema.Types.ObjectId,
});

module.exports = mongoose.model("userExpenseCategory", expenseCategorySchema);
