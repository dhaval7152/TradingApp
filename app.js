require("dotenv").config();

const express = require("express");

const db = require("./db");

const WalletRouter = require("./Routes/WalletRoutes");
const authRouter = require("./Routes/authRoutes");
const stockRoute = require("./Routes/stockRoute");
const tradeRoute = require("./Routes/tradeRoutes");
const portfolioRoute = require("./Routes/portfolioRoutes");
const app = express();
const port = process.env.port || 2000;
const url = process.env.url || "http://localhost:";
db();

const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(WalletRouter);
app.use(authRouter);
app.use(stockRoute);
app.use(tradeRoute);
app.use(portfolioRoute);
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.post("/send", async (req, res) => {
  let data = req.body;
  console.log("🚀 --------------------------🚀");
  console.log("🚀 ~ app.post ~ data:", data);
  console.log("🚀 --------------------------🚀");
  res.send(data);
});

app.listen(port, () => {
  // console.log(`Backend http://localhost:${port}`);
  console.log(`Backend ${url}${port}`);
});

