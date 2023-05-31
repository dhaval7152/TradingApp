require('dotenv').config()
const userModal=require('../Models/User');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const errorMessage = (res, error) => {
    console.log(error);
    return res.status(400).json({ status: "fail", message: error.message });
  };


exports.registerUser=async(req,res)=>{

    try {
        
        const {username,password,email,balance} =req.body;
        if(!username || !password){
            return res.status(200).json({
                status:"fail",
                message:"Username and Password Not Provided"
            });
        }
        if(password.length <= 6 || password.length >= 25){
            return res.status(200).json({
                status:"fail",
                message:"Password Should be between 6-25 characters",
                type:password
            });
        }

        const existingUser=await userModal.findOne({username});
        if(existingUser){
            return res.status(200).json({
                status:"fail",
                message:"This Username is Already Taken",
                type:"username"
            });
        }

        const salt= await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        
        const newUser= new userModal({
            username,
            password:hashedPassword,
            email:email,
            balance:balance
        });
        const savedUser=await newUser.save();
        res.status(201).json(savedUser);


    } catch (error) {
        return errorMessage(res,error)
    }
}

exports.loginUser = async (req, res) => {
    try {
      const { username, password } = req.body;
  
      if (!username || !password) {
        return res.status(200).json({
          status: "fail",
          message: "Not all fields have been entered.",
        });
      }
  
      const user = await userModal.findOne({ username });
  
      if (!user) {
        return res.status(200).json({
          status: "fail",
          message: "Invalid credentials. Please try again.",
        });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(200).json({
          status: "fail",
          message: "Invalid credentials. Please try again.",
        });
      }
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      return res.status(200).json({
        token,
        user: {
          username,
          id: user._id,
          balance: user.balance,
        },
      });
    } catch (error) {
      return errorMessage(res, error);
    }
  };