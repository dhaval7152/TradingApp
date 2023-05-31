const mongoose = require("mongoose");
const {Schema} = require("mongoose");


const userSchema = new Schema({
  userId: {
    type:Number,
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
});

module.exports = mongoose.model("Wallet", userSchema);
