const express = require("express");
const cors = require("cors");
const { verifyToken } = require("./Middlewares/Auth");
const { connectDatabase } = require("./config/db");
const {
  PORT,
  FRONTEND_URL,
  GOOGLE_AUTH_PROMPT_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
} = require("./config/config");
const authRoute = require("./routes/Auth");
const { default: axios } = require("axios");

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

app.post("/api/auth/googleSignIn", async (req, res) => {
  const { code } = req.body;
  const url = `https://oauth2.googleapis.com/token?client_id=${GOOGLE_CLIENT_ID}&client_secret=${GOOGLE_CLIENT_SECRET}&code=${code}&redirect_uri=${GOOGLE_REDIRECT_URI}&grant_type=authorization_code`;
  try {
    const response = await axios.post(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    const data = response.data;
    const { access_token } = data;
    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`
      )
      .then((response) => {
        res.send(response.data);
      })
      .catch((err) => {
        res.status(401).send(err);
      });
  } catch (error) {
    res.status(401).send(error.response.data);
  }
});

app.listen(PORT, () => {
  console.log("server is running at port: " + PORT);
});
