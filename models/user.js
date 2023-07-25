const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  google_id: String,
  profilePicture: String,
  expenseCategory: [
    {
      type: Schema.Types.ObjectId,
      ref: "userExpenseCategory",
    },
  ],
});

module.exports = mongoose.model("users", userSchema);
