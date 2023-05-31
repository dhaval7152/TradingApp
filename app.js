require('dotenv').config()
const express = require('express')

const db =require('./db');

const Router = require("./Routes/routes");
const authRouter = require("./Routes/authRoutes");
const stockRoute = require("./Routes/stockRoute");
const app = express()
const port = process.env.port ||  2000;
db()



const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(Router);
app.use(authRouter);
app.use(stockRoute);
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.post('/send', async (req, res) => {
    let data = req.body;
    console.log("🚀 --------------------------🚀");
    console.log("🚀 ~ app.post ~ data:", data);
    console.log("🚀 --------------------------🚀");
    res.send(data);
})

app.listen(port, () => {
  console.log(`Backend http://localhost:${port}`)
})