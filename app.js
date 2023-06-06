require('dotenv').config()
const express = require('express')

const db =require('./db');

const WalletRouter = require("./Routes/WalletRoutes");
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

app.use(WalletRouter);
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

// setInterval(() => {
//   const updatePrice = async (newPrice) => {
//         const response = await fetch(`http://localhost:${port}/updatePrice`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//           "coinsyml":"shib",
//           "price":newPrice
//           }),
//         });
//         const price =await response.json();
//         console.log("🚀 -------------------------------🚀")
//         console.log("🚀 ~ updatePrice ~ price:", price)
//         console.log("🚀 -------------------------------🚀")
       
//   };
//   console.log("price change");

//  const stockTracker = async () => {

//       console.log("hitting api");
  
//         const response = await fetch(`http://localhost:${port}/stockTracker`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//                     },
//           body: JSON.stringify({
//              "coinsyml":"shib",
//           }),
//         });
//         const ChangedQuntity =await response.json();
//         console.log("🚀 --------------------------------------------------🚀")
//         console.log("🚀 ~ stockTracker ~ ChangedQuntity:", ChangedQuntity)
//         console.log("🚀 --------------------------------------------------🚀")
       
//         let listQunt=ChangedQuntity.ListingQunt
//         let quantityChange=ChangedQuntity.calculation
//         // let listQunt=100
//         // let quantityChange=2
//         function adjustPrice(listQunt, quantityChange) {
//           const priceChangeFactor = 0.001; // Change this factor as desired
          
//           // Calculate the new quantity and adjust the price accordingly
//           if(quantityChange - listQunt  < 0 ){
//             console.log("logic:",quantityChange - listQunt );
//             const newQuantity = listQunt + quantityChange;
//             const priceAdjustment = priceChangeFactor * -quantityChange ;
//             const newPrice = 1 * (1 - priceAdjustment);
//            updatePrice(newPrice)

//             console.log("🚀 -------------------------------------🚀")
//             console.log("🚀 ~ adjustPrice ~ newPrice:", newPrice)
//             console.log("🚀 -------------------------------------🚀")

//           }
         
          
//           // Update the stock data
//           // stockData.Quantity = newQuantity;
//           // stockData.price = newPrice;
          
//           // // Log the updated stock data
//           // console.log("Updated stock data:");
//           // console.log(stockData);
//         }
//         adjustPrice(listQunt,quantityChange)

       
//   };
//   // stockTracker()

//   // Original stock data

//   const marketCap=async()=>{



//   }




// // Function to adjust the price based on stock quantity


// // Example usage: increasing the quantity by 500


  
// }, 3000);

app.listen(port, () => {
  console.log(`Backend http://localhost:${port}`)
})




// function adjustPrice(listQunt, quantityChange) {
//   const priceChangeFactor = 5; // Change this factor as desired
  
//   // Calculate the new quantity and adjust the price accordingly
//   const newQuantity = stockData.Quantity + quantityChange;
//   const priceAdjustment = priceChangeFactor * quantityChange;
//   const newPrice = stockData.price * (1 - priceAdjustment);
  
//   // Update the stock data
//   stockData.Quantity = newQuantity;
//   stockData.price = newPrice;
  
//   // Log the updated stock data
//   console.log("Updated stock data:");
//   console.log(stockData);
// }