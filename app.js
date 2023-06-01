require('dotenv').config()
const express = require('express')

const db =require('./db');

const Router = require("./Routes/routes");
const authRouter = require("./Routes/authRoutes");
const stockRoute = require("./Routes/stockRoute");
const tradeRoute = require("./Routes/tradeRoutes");
const portfolioRoute = require("./Routes/portfolioRoutes");
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
app.use(tradeRoute);
app.use(portfolioRoute);
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

setInterval(() => {
  // const updatePrice = async () => {

  //   let randomPrice= Math.floor(Math.random() * (400 - 300 + 1)) + 300;
  //     console.log("hitting api");
  
  //       const response = await fetch(`http://localhost:${port}/updatePrice`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //         "coinsyml":"bnb",
  //         "price":randomPrice
  //         }),
  //       });
  //       const price =await response.json();
  //       console.log("🚀 -------------------------------🚀")
  //       console.log("🚀 ~ updatePrice ~ price:", price)
  //       console.log("🚀 -------------------------------🚀")
       
  // };
  // updatePrice()
  // console.log("price change");

 const stockTracker = async () => {

      console.log("hitting api");
  
        const response = await fetch(`http://localhost:${port}/stockTracker`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
                    },
          body: JSON.stringify({
             "coinsyml":"xrp",
          }),
        });
        const ChangedQuntity =await response.json();
        console.log("🚀 --------------------------------------------------🚀")
        console.log("🚀 ~ stockTracker ~ ChangedQuntity:", ChangedQuntity)
        console.log("🚀 --------------------------------------------------🚀")
       
        return ChangedQuntity;
       
  };
  stockTracker()

  // Original stock data

// Function to adjust the price based on stock quantity
function adjustPrice(stockData, quantityChange) {
  const priceChangeFactor = 5; // Change this factor as desired
  
  // Calculate the new quantity and adjust the price accordingly
  const newQuantity = stockData.Quantity + quantityChange;
  const priceAdjustment = priceChangeFactor * quantityChange;
  const newPrice = stockData.price * (1 - priceAdjustment);
  
  // Update the stock data
  stockData.Quantity = newQuantity;
  stockData.price = newPrice;
  
  // Log the updated stock data
  console.log("Updated stock data:");
  console.log(stockData);
}

// Example usage: increasing the quantity by 500
adjustPrice(stockData, );


  
}, 3000);

app.listen(port, () => {
  console.log(`Backend http://localhost:${port}`)
})