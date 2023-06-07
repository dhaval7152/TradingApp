const mongoose = require("mongoose");
const {Schema} = require("mongoose");


const limitOrder = new Schema({
  username: {
    type:String,
  },
  orderType: {
    type:String,
    required: true,
  },
  coinsyml: {
    type:String,
    required: true
  },
  CoinkName: {
    type:String,
  },
  price:{
    type:Number, //Decimal128
    required:true
  },
  Quantity: {
    type: Number,
    default: 10,
    required: true,
  },
  usdtAmount: {
    type: Number,
  },
  listedOn: {
    type: Date,
    default: () => Date.now(),
  },
 
});

module.exports = mongoose.model("limitOrder", limitOrder);
