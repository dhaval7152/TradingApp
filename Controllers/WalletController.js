require("dotenv").config();
const userModel = require("../Models/User");
const walletModel = require("../Models/Wallet");
const portfolio = require("../Models/portfolio");
module.exports = {
  deposit: async (req, res) => {
    let data = req.body;
    let username = data.username;
    let amount = data.amount;

    console.log("🚀 --------------------------🚀");
    console.log("🚀 ~ app.post ~ data:", data);
    console.log("🚀 --------------------------🚀");
    try {
      // Finded user
      let findusername = await userModel.findOne({ username: username });
      // // if wallet user deposited already ? update : new entry
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
        return res.send({
          status: "failed",
          message: "No Enought Money to deposit",
        });
      } else if (findDeposit == null) {
        const depositData = new walletModel({
          username: findusername.username,
          upi: findusername.upi,
          deposit: amount,
        });
        await depositData.save();
        updateBalance(amount);
        return res.send({ status: "Funds Added" });
      } else if (findDeposit.username) {
        const deposit = await walletModel.findOneAndUpdate(
          { username: findDeposit.username },
          { deposit: findDeposit.deposit + amount, upi: findusername.upi },
          { new: true }
        );
        updateBalance(amount);
        console.log("update");
        return res.send({ status: "Funds Added" });
      }
    } catch (error) {
      res.send({ status: "fail", message: error.message });
    }
  },
  withdraw: async (req, res) => {
    let { username, amount } = req.body;

    try {
      // Finded user
      let findusername = await userModel.findOne({ username: username });

      let findWithdraw = await walletModel.findOne({ username: username });
      console.log("🚀 -------------------------------------------🚀");
      console.log("🚀 ~ withdraw: ~ findWithdraw:", findWithdraw);
      console.log("🚀 -------------------------------------------🚀");

      // update the Withdraw balance
      const updateBalance = async (amountPlus) => {
        await userModel.findOneAndUpdate(
          { username: username },
          { balance: findusername.balance + amountPlus },
          { new: true }
        );
      };

      if (amount > findWithdraw.deposit) {
        console.log("hello");
        return res.send({
          status: "failed",
          message: "No Enought Money to Withdraw",
        });
      } else if (findWithdraw.username) {
        const deposit = await walletModel.findOneAndUpdate(
          { username: findWithdraw.username },
          { deposit: findWithdraw.deposit - amount },
          { new: true }
        );
        updateBalance(amount);
        console.log("update");
        return res.send({ status: "Funds Withdrawed" });
      }
    } catch (error) {
      res.send({ status: "fail", message: error.message });
    }
  },

  getUserBalance: async (req, res) => {
    let { username } = req.body;
    try {
      let findDeposit = await walletModel.findOne({ username: username });
      let findUPI = await userModel.findOne({ username: username });

      if (!findDeposit) {
        return res.send({ status: "failed", message: "User Not found" });
      }
      return res.send({ upi: findUPI.upi, balance: findDeposit.deposit });
    } catch (error) {
      res.send({ status: "fail", message: error.message });
    }
  },

 
};
