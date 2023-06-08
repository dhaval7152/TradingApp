require("dotenv").config();
const stockModel = require("../Models/Stocks");
const walletModel = require("../Models/Wallet");
const porfolioModel = require("../Models/portfolio");
const userModel = require("../Models/User");
const limitOrder = require("../Models/LimitOrders");

// const host = "http://localhost:5000";
const host = "http://192.168.29.220:5000";
const buyStockApi = async (data) => {
  console.log("calling buyStockApi");
  console.log(data.Amount);
  const response = await fetch(`${host}/buyStock`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // Provide all values to registerUser
    body: JSON.stringify(data),
  });
  const res = await response.json();
  console.log("🚀 -------------------🚀");
  console.log("🚀 ~ buy ~ res:", res);
  console.log("🚀 -------------------🚀");

  if (res.status === "failed") {
    // alert(res.msg)
    console.log("res.msg");

    // setUsernameError(res.message);
    // setPasswordError(res.message);
  } else {
    // alert("BUyed")
    console.log("Buyed");
    // setUserData(res);
    // localStorage.setItem("auth-token", res.token);
    // navigate("/");
  }
};

const sellStockApi = async (data) => {
  console.log("calling sellStockApi");
  const response = await fetch(`${host}/sellStock`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // Provide all values to registerUser
    body: JSON.stringify(data),
  });
  const res = await response.json();
  console.log("🚀 -------------------🚀");
  console.log("🚀 ~ buy ~ res:", res);
  console.log("🚀 -------------------🚀");

  if (res.status === "failed") {
    console.log(res.message);
    // setUsernameError(res.message);
    // setPasswordError(res.message);
  } else {
    console.log("sold");
    // setUserData(res);
    // localStorage.setItem("auth-token", res.token);
    // navigate("/");
  }
};

const updatePrice = async (newPrice) => {
  const response = await fetch(`${host}/updatePrice`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      coinsyml: "xrp",
      price: newPrice,
    }),
  });
  const price = await response.json();
  console.log("🚀 -------------------------------🚀");
  console.log("🚀 ~ updatePrice ~ price:", price);
  console.log("🚀 -------------------------------🚀");
};
module.exports = {
  viewStocks: async (req, res) => {
    let view = await stockModel.find({});
    res.send(view);
  },
  buyStock: async (req, res) => {
    // condition: walllet balance decrease
    // quanity minus from stocks database
    let { username, coinsyml, Amount } = req.body;
    let stock = await stockModel.find({ coinsyml: coinsyml });
    console.log("🚀 -----------------------------🚀");
    console.log("🚀 ~ buyStock: ~ stock:", stock);
    console.log("🚀 -----------------------------🚀");
    let wallet = await walletModel.find({ username: username });

    // let portfolioCheck = await porfolioModel.find({ coinsyml: coinsyml });

    let portfolioCheck = await porfolioModel.find({ username: username });

    const updateBalance = async (amountReduce) => {
      let update = await walletModel.findOneAndUpdate(
        { username: username },
        { deposit: wallet[0].deposit - amountReduce },
        { new: true }
      );
    };
    // Original
    const updateStock = async (Quantity_Reduce) => {
      let updates = await stockModel.findOneAndUpdate(
        { coinsyml: coinsyml },
        { Quantity: stock[0].Quantity - Quantity_Reduce },
        { new: true }
      );
    };

    // how to manage quantity then ,so if Listing Quantity==max supply stop trading

    if (wallet[0].deposit <= 0 || Amount > wallet[0].deposit) {
      return res.send({ status: "failed", msg: "Please Add Funds" });
    }

    // Use OG
    if (stock[0].Quantity < 0 || Amount / stock[0].price > stock[0].Quantity) {
      return res.send({ status: "failed", msg: "All Stock Sold" });
    } else if (portfolioCheck.length > 0) {
      console.log("matched");
      updateBalance(Amount);
      console.log("portfolioCheck.length > 0");

      let buyUpdate = await porfolioModel.findOneAndUpdate(
        { username: username },
        {
          buyPrice: stock[0].price, //avg
          Quantity: portfolioCheck[0].Quantity + Amount / stock[0].price,
          value:
            portfolioCheck[0].value +
            (Amount / stock[0].price) * stock[0].price,
        },
        { new: true }
      );

      let newbuyUpdate = await buyUpdate.save();
      updateStock(newbuyUpdate.Quantity);
      console.log("🚀 -------------------------------------------🚀");
      console.log("🚀 ~ buyStock: ~ newbuyUpdate:", newbuyUpdate);
      console.log("🚀 -------------------------------------------🚀");

      console.log("🚀 -------------------------------------------🚀");
      console.log("🚀 ~ newbuyUpdate.Quantity:", newbuyUpdate.Quantity);
      console.log("🚀 -------------------------------------------🚀");
      // return res.send({test:"test"})
      return res.send(newbuyUpdate);
    } else {
      updateBalance(Amount);

      let newportfolio = new porfolioModel({
        username: username,
        coinsyml: coinsyml,
        buyPrice: stock[0].price,
        Quantity: Amount / stock[0].price,
        value: (Amount / stock[0].price) * stock[0].price,
      });
      let newSaved = await newportfolio.save();
      updateStock(newSaved.Quantity);

      return res.send(newSaved);
    }
  },
  sellStock: async (req, res) => {
    // condition: walllet balance increase
    // quanity plus to stocks

    let { username, coinsyml, Amount } = req.body;

    let stock = await stockModel.find({ coinsyml: coinsyml });

    let wallet = await walletModel.find({ username: username });

    let portfolioCheck = await porfolioModel.find({ username: username });

    const updateBalance = async (amountPlus) => {
      let update = await walletModel.findOneAndUpdate(
        { username: username },
        { deposit: wallet[0].deposit + amountPlus },
        { new: true }
      );
    };
    const updateStock = async (Quantity_Reduce) => {
      let updates = await stockModel.findOneAndUpdate(
        { coinsyml: coinsyml },
        { Quantity: stock[0].Quantity + Quantity_Reduce },
        { new: true }
      );
    };

    //  if (portfolioCheck[0].Quantity == 0) {
    //   return res.send({ status: "failed", message: "No Quantity Left" });
    // }
    if (Amount / stock[0].price > portfolioCheck[0].Quantity) {
      return res.send({ status: "failed", message: "No Quantity Left" });
    } else if (portfolioCheck.length > 0 && portfolioCheck[0].Quantity > 0) {
      updateBalance(Amount);
      console.log("matched");

      let sellUpdate = await porfolioModel.findOneAndUpdate(
        { username: username },
        {
          Quantity: portfolioCheck[0].Quantity - Amount / stock[0].price,
          value:
            portfolioCheck[0].value -
            (Amount / stock[0].price) * stock[0].price,
        },
        { new: true }
      );

      let newsellUpdate = await sellUpdate.save();
      updateStock(Amount / stock[0].price);
      console.log("🚀 -------------------------------------------🚀");
      console.log("🚀 ~ buyStock: ~ newbuyUpdate:", newsellUpdate);
      console.log("🚀 -------------------------------------------🚀");
      return res.send(newsellUpdate);
    }
    // else if (portfolioCheck[0].Quantity == 0) {
    //   return res.send({ status: "failed", message: "No Quantity Left" });
    // }
    else {
      res.send({ status: "failed", message: "Stock not found" });
    }

    // autoMatchOrder:
  },
  limitOrder: async (req, res) => {
    // set orderType in handlebuy and sell
    let data = req.body;

    try {
      let createOrder = new limitOrder(data);
      let newcreateOrder = await createOrder.save();
      res.send(newcreateOrder);
    } catch (error) {
      res.send({ status: "fail", message: error.message });
    }
  },
  askBid: async (req, res) => {
    console.log("hitting askBid from backend");
    // Bid=Buyer Ask=seller
    try {
      let gerBuyOrders = await limitOrder
        .findOne({ orderType: "Bid" })
        .sort({ price: "descending" });

      let gerSellOrders = await limitOrder
        .findOne({ orderType: "Ask" })
        .sort({ price: "descending" });

      if (gerBuyOrders === null && gerSellOrders === null) {
        console.log("No data Found");
        return res.send({ msg: "Not data Found" });
      } else {
        // console.log("test gerSellOrders", gerSellOrders);
        // console.log("test else");
        if (gerBuyOrders == null || gerSellOrders == null) {
          res.send("Do nothing gerBuyOrders==null");
        } else {
          console.log(gerBuyOrders.price);
          console.log(gerSellOrders.price);
          // res.send("Match orders")

          if (gerBuyOrders.price === gerSellOrders.price) {
            console.log("order match");
            console.log("set new price", gerBuyOrders.price);

            // delete
            //  let placeBuy=await limitOrder.findOneAndDelete({price:gerBuyOrders.price})
            //  let placeSell=await limitOrder.findOneAndDelete({price:gerSellOrders.price})

            //  update quntity
            let findBuy = await limitOrder.findOne({
              orderType: gerBuyOrders.orderType,
            });
            let findSell = await limitOrder.findOne({
              orderType: gerSellOrders.orderType,
            });

            buyStockApi({
              username: findBuy.username,
              coinsyml: findBuy.coinsyml,
              Amount: findBuy.Quantity * findBuy.price,
            });

            sellStockApi({
              username: findSell.username,
              coinsyml: findSell.coinsyml,
              Amount: findBuy.Quantity * findBuy.price,
            });

            updatePrice(findBuy.price);

            let placeBuy = await limitOrder.findOneAndUpdate(
              { orderType: gerBuyOrders.orderType },
              { Quantity: findBuy.Quantity - findBuy.Quantity },
              { new: true }
            );

            let placeSell = await limitOrder.findOneAndUpdate(
              { orderType: gerSellOrders.orderType },
              { Quantity: findSell.Quantity - findBuy.Quantity },
              { new: true }
            );

            let BidfindDelete = await limitOrder
              .findOne({ Quantity: 0 })
              .deleteMany();

            return res.send({ newPrice: gerBuyOrders.price });
          } else {
            return res.send({ status: "No Orders matched" });
          }
        }
      }
    } catch (error) {
      console.log(error);
      res.send({ status: "fail", message: error.message });
    }
  },
  viewAsk: async (req, res) => {
    // Bid=Buyer Ask=seller
    try {
      // let  gerBuyOrders=await limitOrder.findOne({orderType: "Bid"}).sort({price:"descending"})
      let gerSellOrders = await limitOrder
        .find({ orderType: "Ask" })
        .sort({ price: "descending" });

      if (gerSellOrders.length != 0) {
        return res.send(gerSellOrders);
      } else {
        // return res.send({message:"NO data FOund"})
        return res.send([
          {
            orderType: "Ask",
            price: 0,
            Quantity: 0,
          },
        ]);
      }
    } catch (error) {
      console.log(error);
      res.send({ status: "fail", message: error.message });
    }
  },
  viewBid: async (req, res) => {
    // Bid=Buyer Ask=seller
    try {
      // let  gerBuyOrders=await limitOrder.findOne({orderType: "Bid"}).sort({price:"descending"})
      let gerSellOrders = await limitOrder
        .find({ orderType: "Bid" })
        .sort({ price: "descending" });

      if (gerSellOrders.length != 0) {
        return res.send(gerSellOrders);
      } else {
        // return res.send({message:"NO data FOund"})
        return res.send([
          {
            orderType: "Bid",
            price: 0,
            Quantity: 0,
          },
        ]);
      }
    } catch (error) {
      console.log(error);
      res.send({ status: "fail", message: error.message });
    }
  },
  
};
