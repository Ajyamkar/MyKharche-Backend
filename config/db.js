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
    .connect(
      "mongodb+srv://ajyamkar99:GWmpCw9DOOnqP2Iv@cluster0.lg01jwk.mongodb.net/MyKharche",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then(() => {
      console.log("Connected to database");
    });
};

module.exports = { usersDB, connectDatabase };
