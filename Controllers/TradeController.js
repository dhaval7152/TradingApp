require("dotenv").config();
const stockController = require("../Models/Stocks");
const walletModel = require("../Models/Wallet");
const porfolioModel = require("../Models/portfolio");
const userModel = require("../Models/User");

module.exports = {
  viewStocks: async (req, res) => {
    let view = await stockController.find({});
    res.send(view);
  },
  buyStock: async (req, res) => {
    // condition: walllet balance decrease
    // quanity minus from stocks database
    let { username, coinsyml, Amount } = req.body;
    let stock = await stockController.find({ coinsyml: coinsyml });
    let wallet = await walletModel.find({ username: username });

    let portfolioCheck = await porfolioModel.find({ coinsyml: coinsyml });

    if (portfolioCheck.length > 0) {
      console.log("matched");

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
      console.log("🚀 -------------------------------------------🚀");
      console.log("🚀 ~ buyStock: ~ newbuyUpdate:", newbuyUpdate);
      console.log("🚀 -------------------------------------------🚀");
      return res.send(newbuyUpdate);
    } else {
      let newportfolio = new porfolioModel({
        username: username,
        coinsyml: coinsyml,
        buyPrice: stock[0].price,
        Quantity: Amount / stock[0].price,
        value: (Amount / stock[0].price) * stock[0].price,
      });
      let newSaved = await newportfolio.save();
      return res.send(newSaved);
    }
  },
  sellStock: async (req, res) => {
    // condition: walllet balance increase
    // quanity plus to stocks

    let { username, coinsyml, Amount } = req.body;

    let stock = await stockController.find({ coinsyml: coinsyml });

    let wallet = await walletModel.find({ username: username });

    let portfolioCheck = await porfolioModel.find({ coinsyml: coinsyml });

    if (portfolioCheck.length > 0 && portfolioCheck[0].Quantity > 0) {
      console.log("matched");

      let sellUpdate = await porfolioModel.findOneAndUpdate(
        { coinsyml: coinsyml },
        {
          Quantity: portfolioCheck[0].Quantity - Amount / stock[0].price,
          value:
            portfolioCheck[0].value -
            (Amount / stock[0].price) * stock[0].price,
        },
        { new: true }
      );

      let newsellUpdate = await sellUpdate.save();
      console.log("🚀 -------------------------------------------🚀");
      console.log("🚀 ~ buyStock: ~ newbuyUpdate:", newsellUpdate);
      console.log("🚀 -------------------------------------------🚀");
      return res.send(newsellUpdate);
    } else if (portfolioCheck[0].Quantity == 0) {
      return res.send({ status: "failed", message: "No Quantity Left" });
    } else {
      res.send({ status: "failed", message: "Stock not found" });
    }

  },
};
