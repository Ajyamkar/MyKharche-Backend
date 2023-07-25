const mongoose = require("mongoose");
const { Schema } = mongoose;

const expenseCategorySchema = Schema({
  categoryName: String,
  categoryType: String,
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

module.exports = mongoose.model("userExpenseCategory", expenseCategorySchema);
