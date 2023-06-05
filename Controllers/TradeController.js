require("dotenv").config();
const stockModel = require("../Models/Stocks");
const walletModel = require("../Models/Wallet");
const porfolioModel = require("../Models/portfolio");
const userModel = require("../Models/User");

module.exports = {
  viewStocks: async (req, res) => {
    let view = await stockModel.find({});
    res.send(view);
  },
  buyStock: async (req, res) => {
    // condition: walllet balance decrease
    // quanity minus from stocks database
    let { username, coinsyml, Amount } = req.body;
    let stock = await stockModel.find({ coinsyml: coinsyml });
    console.log("🚀 -----------------------------🚀")
    console.log("🚀 ~ buyStock: ~ stock:", stock)
    console.log("🚀 -----------------------------🚀")
    let wallet = await walletModel.find({ username: username });

    let portfolioCheck = await porfolioModel.find({ coinsyml: coinsyml });
    


    const updateBalance = async (amountReduce) => {
      let update= await walletModel.findOneAndUpdate(
        { username: username },
        { deposit:  wallet[0].deposit  -amountReduce },
        { new: true }
      );
    };
    // Original
    const updateStock = async (Quantity_Reduce) => {
      let updates= await stockModel.findOneAndUpdate(
        { coinsyml: coinsyml },
        { Quantity:  stock[0].Quantity  - Quantity_Reduce },
        { new: true }
      );
    };

    // For supply test(this function is  underTest)
    // const updateStock = async (Quantity_Reduce) => {
    //   let updates= await stockModel.findOneAndUpdate(
    //     { coinsyml: coinsyml },
    //     { Quantity:  stock[0].Quantity  + Quantity_Reduce },
    //     { new: true }
    //   );
    // };

    // how to manage quantity then ,so if Listing Quantity==max supply stop trading

    if(wallet[0].deposit <= 0 || Amount > wallet[0].deposit){
      return res.send({status:"failed",msg:"Please Add Funds"})
    }
    
    else if (portfolioCheck.length > 0 ) {
      console.log("matched");
      updateBalance(Amount)
      let buyUpdate = await porfolioModel.findOneAndUpdate(
        { coinsyml: coinsyml },
        {
          buyPrice: stock[0].price, //avg
          Quantity: portfolioCheck[0].Quantity + Amount / stock[0].price,
          value:
            portfolioCheck[0].value +
            (Amount / stock[0].price) * stock[0].price,
        },
        { new: true }
      );
      
      
      let newbuyUpdate = await buyUpdate.save();
      updateStock(newbuyUpdate.Quantity)
      console.log("🚀 -------------------------------------------🚀");
      console.log("🚀 ~ buyStock: ~ newbuyUpdate:", newbuyUpdate);
      console.log("🚀 -------------------------------------------🚀");

      console.log("🚀 -------------------------------------------🚀");
      console.log("🚀 ~ newbuyUpdate.Quantity:", newbuyUpdate.Quantity);
      console.log("🚀 -------------------------------------------🚀");
      return res.send(newbuyUpdate);
    } else {
      updateBalance(Amount)

      let newportfolio = new porfolioModel({
        username: username,
        coinsyml: coinsyml,
        buyPrice: stock[0].price,
        Quantity: Amount / stock[0].price,
        value: (Amount / stock[0].price) * stock[0].price,
      });
      let newSaved = await newportfolio.save();
      updateStock(newSaved.Quantity)

      return res.send(newSaved);
    }
  },
  sellStock: async (req, res) => {
    // condition: walllet balance increase
    // quanity plus to stocks

    let { username, coinsyml, Amount } = req.body;

    let stock = await stockModel.find({ coinsyml: coinsyml });

    let wallet = await walletModel.find({ username: username });

    let portfolioCheck = await porfolioModel.find({ coinsyml: coinsyml });

    const updateBalance = async (amountPlus) => {
      let update= await walletModel.findOneAndUpdate(
        { username: username },
        { deposit:  wallet[0].deposit  + amountPlus },
        { new: true }
      );
    };
    const updateStock = async (Quantity_Reduce) => {
      let updates= await stockModel.findOneAndUpdate(
        { coinsyml: coinsyml },
        { Quantity:  stock[0].Quantity  + Quantity_Reduce },
        { new: true }
      );
    };

    //  if (portfolioCheck[0].Quantity == 0) {
    //   return res.send({ status: "failed", message: "No Quantity Left" });
    // }
     if (Amount / stock[0].price > portfolioCheck[0].Quantity) {
      return res.send({ status: "failed", message: "No Quantity Left" });
    }
    else if (portfolioCheck.length > 0 &&  portfolioCheck[0].Quantity > 0) {
      updateBalance(Amount)
      console.log("matched");

      let sellUpdate = await porfolioModel.findOneAndUpdate(
        { coinsyml: coinsyml },
        {
          Quantity: portfolioCheck[0].Quantity - (Amount / stock[0].price),
          value:
            portfolioCheck[0].value -
            (Amount / stock[0].price) * stock[0].price,
        },
        { new: true }
      );

      let newsellUpdate = await sellUpdate.save();
      updateStock(Amount / stock[0].price)
      console.log("🚀 -------------------------------------------🚀");
      console.log("🚀 ~ buyStock: ~ newbuyUpdate:", newsellUpdate);
      console.log("🚀 -------------------------------------------🚀");
      return res.send(newsellUpdate);
    } 
    // else if (portfolioCheck[0].Quantity == 0) {
    //   return res.send({ status: "failed", message: "No Quantity Left" });
    // }
     else {
      res.send({ status: "failed", message: "Stock not found" });
    }

    // autoMatchOrder:
  },
};
