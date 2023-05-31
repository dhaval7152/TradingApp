require("dotenv").config();
const stockController=require('../Models/Stocks')
const walletModel = require("../Models/Wallet");
const userModel = require("../Models/User");


module.exports={

    listStock:async(req,res)=>{
        res.send("listStock")
    }
}