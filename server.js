const express = require("express");
const cors = require("cors");
const { verifyToken } = require("./Middlewares/Auth");
const { connectDatabase } = require("./config/db");
const {
  PORT,
  FRONTEND_URL,
  GOOGLE_AUTH_PROMPT_URL,
} = require("./config/config");
const authRoute = require("./routes/Auth");

const app = express();

app.use(express.json());
app.use(cors({ credentials: true, origin: FRONTEND_URL }));
connectDatabase();

// Routes
app.use("/api/auth", authRoute);

app.get("/api/dashboard", verifyToken, (req, res) => {
  res.send({ message: "Dashboard", user: req.user });
});

app.get("/", (req, res) => {
  res.send("Welcome to Mykharche backend");
});

app.get("/api/getAuthUrl/google", (req, res) => {
  res.send(GOOGLE_AUTH_PROMPT_URL);
});

app.listen(PORT, () => {
  console.log("server is running at port: " + PORT);
});
