const mongoose = require("mongoose");
const {Schema} = require("mongoose");

// const portfolioSchema = new Schema({
//   coinsyml: String,
//   price: Number,
//   Quantity: Number,
//   value: Number,
// });

const WalletSchema = new Schema({
  username: {
    type:String,
    required: true,
    unique:true,
  },
  upi: String,
  deposit: Number,
  depositedAt: {
    type: Date,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Date,
    default: () => Date.now(),
  },
  // portfolio:[portfolioSchema],
});

module.exports = mongoose.model("Wallet", WalletSchema);
