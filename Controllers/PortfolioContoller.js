require("dotenv").config();
const stockController = require("../Models/Stocks");
const walletModel = require("../Models/Wallet");
const porfolioModel = require("../Models/portfolio");
const userModel = require("../Models/User");

module.exports = {
  viewPortfolio: async (req, res) => {
    let {username}=req.body;

    try {
    let viewAll = await porfolioModel.find({username:username});
    if(viewAll.length > 0){
      return res.send(viewAll);
    }
    else{
      return res.send({status:"failed", message: "No Stocks found" })
    }
  } catch (error) {
      
  }
  },
 
};
