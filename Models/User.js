const mongoose = require("mongoose");
const {Schema} = require("mongoose");

const addressSchema = new Schema({
  street: String,
  city: String,
});

const userSchema = new Schema({
  // userId: {
  //   type:Number,
  //   unique:true,
  //   // required: true
  // },
  username: {
    type:String,
    unique:true,
    required: true
  },
  password:{
    type:String,
    required:true
  },
  name: {
    type: String,
    // required: true,
    lowercase: true,
  },
  // age: Number,
  // email: {
  //   type:String,
  //   unique:true,
  //   required:true
  // },
  upi: String,
  balance: Number,
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Date,
    default: () => Date.now(),
  },
  address: addressSchema,
});

module.exports = mongoose.model("User", userSchema);
