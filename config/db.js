const mongoose = require("mongoose");
const { MONGO_URL } = require("./config");

const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
});
const usersDB = mongoose.model("users", userSchema);

const connectDatabase = () => {
  mongoose
    .connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to database");
    });
};

module.exports = { usersDB, connectDatabase };
