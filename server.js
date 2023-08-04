const express = require("express");
const cors = require("cors");
const { verifyToken } = require("./Middlewares/Auth");
const { connectDatabase, usersDB, expenseCategoryDB } = require("./config/db");
const { PORT, FRONTEND_URL } = require("./config/config");
const authRoute = require("./routes/Auth");
const expenseRoute = require("./routes/Expenses");
const incomeRoute = require("./routes/Income");

const app = express();

app.use(express.json());
app.use(cors({ credentials: true, origin: FRONTEND_URL }));
connectDatabase();

// Routes
app.use("/api/auth", authRoute);
app.use("/api/expense", expenseRoute);
app.use("/api/income", incomeRoute);

app.get("/api/dashboard", verifyToken, (req, res) => {
  res.send({ message: "Dashboard", user: req.user });
});

app.get("/", (req, res) => {
  res.send("Welcome to Mykharche backend");
});

app.listen(PORT, () => {
  console.log("server is running at port: " + PORT);
});
