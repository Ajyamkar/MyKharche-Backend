const express = require("express");

const app = express();
const PORT = 3001;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("sucessfully created repo.");
});

app.listen(PORT, () => {
  console.log("server is running at port: " + PORT);
});
