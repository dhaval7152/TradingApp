const mongoose = require("mongoose");
const {Schema} = require("mongoose");


const stockSchema = new Schema({
  coinsyml: {
    type:String,
    unique:true,
    required: true
  },
  CoinkName: {
    type:String,
    unique:true,
    required: true
  },
  price:{
    type:Number, //Decimal128
    required:true
  },
  Listing_Quantity: {
    type: Number,
    required: true,
  },
  Quantity: {
    type: Number,
    required: true,
  },
  listedOn: {
    type: Date,
    default: () => Date.now(),
  },
 
});

module.exports = mongoose.model("Stocks", stockSchema);
