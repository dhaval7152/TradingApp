require("dotenv").config();
const stockController = require("../Models/Stocks");
const walletModel = require("../Models/Wallet");
const userModel = require("../Models/User");

module.exports = {
  listStock: async (req, res) => {
    let data = req.body;

    try {
      let addStock = new stockController(data);
      let newStock = await addStock.save();
      res.send(newStock);
    } catch (error) {
      res.send({ status: "fail", message: error.message });
    }
  },
  updatePrice: async (req, res) => {
    let data = req.body;

    try {
      let addStock = await stockController.findOneAndUpdate(
        {coinsyml:data.coinsyml},
        {
          price:data.price
        }
        
        );
      res.send(addStock);
    } catch (error) {
      res.send({ status: "fail", message: error.message });
    }
  },
  stockTracker: async (req, res) => {
    let {coinsyml} = req.body;
    const Qunt = await stockController.findOne({coinsyml:coinsyml})
     
    const ListingQunt=Qunt.Listing_Quantity;

    let trackQunt= await stockController.findOne({coinsyml:coinsyml});
    let trackChange=trackQunt.Quantity;
    // console.log("🚀 ---------------------------------------------🚀")
    // console.log("🚀 ~ stockTracker: ~ trackChange:", trackChange)
    // console.log("🚀 ---------------------------------------------🚀")

    let calculation=ListingQunt-trackChange;
    // console.log("🚀 ---------------------------------------------🚀")
    // console.log("🚀 ~ stockTracker: ~ calculation:", calculation)
    // console.log("🚀 ---------------------------------------------🚀")


   
  //     res.send(addStock);
    res.send({ListingQunt,calculation})

   
  },
};
