const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  google_id: String,
  profilePicture: String,
});

module.exports = mongoose.model("users", userSchema);
