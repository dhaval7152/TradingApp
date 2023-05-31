require("dotenv").config();
const userModel = require("../Models/User");
const walletModel = require("../Models/Wallet");
module.exports = {
  // signUP: async (req, res) => {
  //   let data = req.body;

  //   console.log("🚀 --------------------------🚀");
  //   console.log("🚀 ~ app.post ~ data:", data);
  //   console.log("🚀 --------------------------🚀");
  //   // res.send(data);

  //   const userData = new userModel(req.body);
  //   try {
  //     await userData.save();
  //     //   response.send(user);
  //   } catch (error) {
  //     //   next(error)
      // console.log(error);
  //   }
  //   res.send({ Status: "User Added Succefully" });
  // },

  deposit: async (req, res) => {
    let data = req.body;
    let username = data.username;
    let amount = data.amount;

    console.log("🚀 --------------------------🚀");
    console.log("🚀 ~ app.post ~ data:", data);
    console.log("🚀 --------------------------🚀");

    // Finded user
    let findusername = await userModel.findOne({ username: username });
    console.log("🚀 ------------------------------------------🚀")
    console.log("🚀 ~ deposit: ~ findusername:", findusername)
    console.log("🚀 ------------------------------------------🚀")
   

    let updateBal = findusername.balance - amount;

    // // if wallet user deposited already ? update : new entry
    try {

    let findDeposit = await walletModel.findOne({ username: username });
    console.log("🚀 ----------------------------------------🚀");
    console.log("🚀 ~ deposit: ~ findDeposit:", findDeposit);
    console.log("🚀 ----------------------------------------🚀");

     // update the deposit balance
     const updateBalance = async (amountReduce) => {
        await userModel.findOneAndUpdate(
          { username: username },
          { balance: findusername.balance - amountReduce },
          { new: true }
        );
      };

    if (amount > findusername.balance) {
        return res.send({"status":"No Enought Money to deposit"});
      } 
    else if (findDeposit == null) {
      const depositData = new walletModel({
        username: findusername.username,
        upi: findusername.upi,
        deposit: amount,
      });
      await depositData.save();
      updateBalance(amount)
      return res.send({"status":"Funds Added"});

    } 
  
    else if (findDeposit.username) {
      const deposit = await walletModel.findOneAndUpdate(
        { username: findDeposit.username },
        { deposit: findDeposit.deposit + amount },
        { new: true }
      );
      updateBalance(amount)
      console.log("update");
      return res.send({"status":"Funds Added"});



    }
  } catch (error) {
      res.send(error)
  }
   
  },
  withdraw: async (req, res) => {
    let data = req.body;
    let userId = data.username;
    let amount = data.amount;

    console.log("🚀 --------------------------🚀");
    console.log("🚀 ~ app.post ~ data:", data);
    console.log("🚀 --------------------------🚀");
    res.send(data);

    // Finded user
    let finduserId = await userModel.findOne({ userId: userId });
    let updateBal = finduserId.balance + amount;

    // if wallet user deposited already ? update : new entry
    let findDeposit = await walletModel.findOne({ userId: userId });
    console.log("🚀 ----------------------------------------🚀");
    console.log("🚀 ~ deposit: ~ findDeposit:", findDeposit);
    console.log("🚀 ----------------------------------------🚀");

     // update the Withdraw balance
     const updateBalance = async (amountReduce) => {
        await userModel.findOneAndUpdate(
          { userId: userId },
          { balance: finduserId.balance + amountReduce },
          { new: true }
        );
      };

    if (amount > findDeposit.deposit) {
        console.log("nathi bhai paisa");
      } 
    else if (findDeposit == null) {
      const depositData = new walletModel({
        userId: finduserId.userId,
        upi: finduserId.upi,
        deposit: amount,
      });
      await depositData.save();
      updateBalance(amount)
    } 
  
    else if (findDeposit.userId) {
      const deposit = await walletModel.findOneAndUpdate(
        { userId: findDeposit.userId },
        { deposit: findDeposit.deposit - amount },
        { new: true }
      );
      updateBalance(amount)

      console.log("update");
    }
}
}
