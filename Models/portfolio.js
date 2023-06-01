const mongoose = require("mongoose");
const {Schema} = require("mongoose");



const PortfolioSchema = new Schema({
  username: {
    type:String,
    required: true,
  },
  coinsyml: String,
  buyPrice: Number,
  Quantity: Number,
  value: Number,
  BuyedOn: {
    type: Date,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Date,
    default: () => Date.now(),
  },
});

module.exports = mongoose.model("portfolio", PortfolioSchema);
