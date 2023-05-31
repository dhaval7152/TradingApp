const mongoose = require("mongoose");
const {Schema} = require("mongoose");


const stockSchema = new Schema({
  stockId: {
    type:Number,
    unique:true,
    required: true
  },
  StockName: {
    type:String,
    unique:true,
    required: true
  },
  price:{
    type:Number,
    required:true
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
