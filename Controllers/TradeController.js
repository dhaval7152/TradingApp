require("dotenv").config();
const stockModel = require("../Models/Stocks");
const walletModel = require("../Models/Wallet");
const porfolioModel = require("../Models/portfolio");
const userModel = require("../Models/User");
const limitOrder = require("../Models/LimitOrders");

const host = process.env.host;

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
  console.log("🚀 ~ buyStockApi ~ res:", res);
  console.log("🚀 -------------------🚀");

  if (res.status === "failed") {
    console.log("res.message");
  } else {
    console.log("Buyed");
  }
};

const sellStockApi = async (data) => {
  console.log("calling sellStockApi");
  const response = await fetch(`${host}/sellStock`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const res = await response.json();
  console.log("🚀 -------------------🚀");
  console.log("🚀 ~ sellStockApi ~ res:", res);
  console.log("🚀 -------------------🚀");

  if (res.status === "failed") {
    console.log(res.message);
    // setUsernameError(res.message);
    // setPasswordError(res.message);
  } else {
    // console.log("sold");
    console.log(res.message);
  }
};

const updatePrice = async (data) => {
  let { coinsyml, newprice } = data;
  const response = await fetch(`${host}/updatePrice`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      coinsyml: coinsyml, //dyanamic pass coinsyml
      price: newprice,
    }),
  });
  const price = await response.json();
  console.log("🚀 -------------------------------🚀");
  console.log("🚀 ~ updatePrice ~ Newprice:", price);
  console.log("🚀 -------------------------------🚀");
};
module.exports = {
  viewStocks: async (req, res) => {
    try {
      let view = await stockModel.find({});
      return res.send(view);
    } catch (error) {
      console.log(error);
      res.send({ status: "fail", message: error.message });
    }
  },
  buyStock: async (req, res) => {
    try {
      // condition: walllet balance decrease
      // quanity minus from stocks database
      let { username, coinsyml, Amount, orderType } = req.body;

      let stock = await stockModel.find({ coinsyml: coinsyml });
      let wallet = await walletModel.find({ username: username });

      let portfolioCheck = await porfolioModel.find({
        username: username,
        coinsyml: coinsyml,
      });

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

      const averagePrice= async(shareBought,buyPrice)=>{
        let existingShare=await porfolioModel.findOne({username: username,coinsyml:coinsyml})
        let totalBuy=existingShare.Quantity+shareBought;
        console.log("🚀 ----------------------------------------🚀")
        console.log("🚀 ~ //averagePrice ~ totalBuy:", totalBuy)
        console.log("🚀 ----------------------------------------🚀")
        let amountBought=existingShare.Quantity * existingShare.buyPrice + shareBought * buyPrice;
        console.log("🚀 ------------------------------------------------🚀")
        console.log("🚀 ~ //averagePrice ~ amountBought:", amountBought)
        console.log("🚀 ------------------------------------------------🚀")
        let avgPrice= amountBought / totalBuy;
        console.log("🚀 ----------------------------------------🚀")
        console.log("🚀 ~ //averagePrice ~ avgPrice:", avgPrice)
        console.log("🚀 ----------------------------------------🚀")

      }

      if (wallet[0].deposit <= 0 || Amount > wallet[0].deposit) {
        return res.send({
          status: "failed",
          message: "Insufficient Funds ! Please Add Funds",
        });
      }

      if (!orderType === "Bid") {
        console.log("Bid order in Buy api");
        if (
          stock[0].Quantity < 0 ||
          Amount / stock[0].price > stock[0].Quantity
        ) {
          return res.send({ status: "failed", message: "All Stock Sold" });
        }
      } else if (portfolioCheck.length > 0) {
        averagePrice( Amount / stock[0].price, stock[0].price)

        let buyUpdate = await porfolioModel.findOneAndUpdate(
          { username: username, coinsyml: coinsyml },
          {
            buyPrice: stock[0].price, //avg
            Quantity: portfolioCheck[0].Quantity + Amount / stock[0].price,
            value:
              portfolioCheck[0].value +
              (Amount / stock[0].price) * stock[0].price,
          },
          { new: true }
        );

        updateBalance(Amount);

        // console.log(
        //   "buying Quntity",
        //   portfolioCheck[0].Quantity + Amount / stock[0].price
        // );
        console.log("buying Quntity", portfolioCheck[0].Quantity);
        console.log("🚀 -------------------------------------🚀");
        console.log("🚀 ~ buyStock: ~ buyUpdate:", buyUpdate);
        console.log("🚀 -------------------------------------🚀");

        let newbuyUpdate = await buyUpdate.save();

        if (orderType === "Bid") {
          console.log("Bid order in Buy api");
        } else {
          updateStock(newbuyUpdate.Quantity);
        }

        // updateStock(newbuyUpdate.Quantity);

        // New change
        // if (orderType === "Bid") {
        //   console.log("Bid order in Buy api");
        // } else {
        //   updateStock(newbuyUpdate.Quantity);
        // }

        console.log("🚀 -------------------------------------------🚀");
        console.log("🚀 ~ buyStock: ~ newbuyUpdate:", newbuyUpdate);
        console.log("🚀 -------------------------------------------🚀");

        console.log("🚀 ~ newbuyUpdate.Quantity:", newbuyUpdate.Quantity);
        // return res.send({test:"test"})
        return res.send({
          status: "success",
          message: `Stock Added Qunt:${Amount / stock[0].price} Succefully!`,

          newbuyUpdate,
        });
      } else {
        let newportfolio = new porfolioModel({
          username: username,
          coinsyml: coinsyml,
          buyPrice: stock[0].price,
          Quantity: Amount / stock[0].price,
          value: (Amount / stock[0].price) * stock[0].price,
        });
        let newSaved = await newportfolio.save();
        updateBalance(Amount);

        // updateStock(newSaved.Quantity);

        if (orderType === "Bid") {
          console.log("Bid order in Buy api");
        } else {
          updateStock(newSaved.Quantity);
        }

        return res.send({
          status: "success",
          // message: "Stock Buyed Succefully!",
          message: `${stock[0].CoinkName} Quantity ${
            Amount / stock[0].price
          } Buyed Succefully`,
          newSaved,
        });
      }
    } catch (error) {
      console.log(error);
      res.send({ status: "fail", message: error.message });
    }
  },
  sellStock: async (req, res) => {
    // condition: walllet balance increase
    // quanity plus to stocks

    let { username, coinsyml, Amount, orderType } = req.body;
    try {
      let stock = await stockModel.find({ coinsyml: coinsyml });

      let wallet = await walletModel.find({ username: username });

      let portfolioCheck = await porfolioModel.find({
        username: username,
        coinsyml: coinsyml,
      });

      const updateBalance = async (amountPlus) => {
        console.log("amountPlus", amountPlus);
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
        let sellUpdate = await porfolioModel.findOneAndUpdate(
          { username: username, coinsyml: coinsyml },
          {
            Quantity: portfolioCheck[0].Quantity - Amount / stock[0].price,
            value:
              portfolioCheck[0].value -
              (Amount / stock[0].price) * stock[0].price,
          },
          { new: true }
        );

        let newsellUpdate = await sellUpdate.save();
        updateBalance((Amount / stock[0].price) * stock[0].price);

        if (orderType === "Ask") {
          console.log("Ask order in sell api");
        } else {
          updateStock(Amount / stock[0].price);
        }
        // updateStock(Amount / stock[0].price);

        console.log("🚀 -------------------------------------------🚀");
        console.log("🚀 ~ sellStock: ~ newbuyUpdate:", newsellUpdate);
        console.log("🚀 -------------------------------------------🚀");
        return res.send({
          status: "success",
          message: `${stock[0].CoinkName} Quantity ${
            Amount / stock[0].price
          } Sold Succefully`,
          newsellUpdate,
        });
      } else {
        res.send({ status: "failed", message: "Stock not found" });
      }
    } catch (error) {
      return res.send(error);
    }

    // autoMatchOrder:
  },
  limitOrder: async (req, res) => {
    // set orderType in handlebuy and sell
    let data = req.body;
    console.log("limitOrder", data);

    try {
      if (data.orderType === "Bid") {
        let createOrder = new limitOrder(data);
        let newcreateOrder = await createOrder.save();
        return res.send(newcreateOrder);
      }

      let portfolioCheck = await porfolioModel.find({
        username: data.username,
        coinsyml: data.coinsyml,
      });
      console.log("🚀 -------------------------------------------------🚀");
      console.log("🚀 ~ limitOrder: ~ portfolioCheck:", portfolioCheck);
      console.log("🚀 -------------------------------------------------🚀");
      console.log("portfolioCheck", portfolioCheck);
      // if (portfolioCheck.length === 0) {
      if (portfolioCheck.Quantity <= 0) {
        return res.send({
          status: "fail",
          message: "You Don't Have any stocks To Ask",
        });
      }
      if (!portfolioCheck.length === 0) {
        if (data.Quantity > portfolioCheck[0].Quantity) {
          return res.send({
            status: "fail",
            message: "You Don't Have any stocks To Ask",
          });
        }
      } else {
        let createOrder = new limitOrder(data);
        let newcreateOrder = await createOrder.save();
        return res.send(newcreateOrder);
      }
    } catch (error) {
      res.send({ status: "fail", message: error.message });
    }
  },
  askBid: async (req, res) => {
    let { coinsyml } = req.body;
    let data = req.body;

    console.log("hitting askBid from backend");
    // Bid=Buyer Ask=seller

    try {
      let gerBuyOrders = await limitOrder
        .findOne({ orderType: "Bid", coinsyml: coinsyml })
        .sort({ price: "descending" });
      console.log("🚀 -----------------------------------------🚀");
      console.log("🚀 ~ askBid: ~ gerBuyOrders:", gerBuyOrders);
      console.log("🚀 -----------------------------------------🚀");

      let gerSellOrders = await limitOrder
        .findOne({ orderType: "Ask", coinsyml: coinsyml })
        .sort({ price: "descending" });
      console.log("🚀 -------------------------------------------🚀");
      console.log("🚀 ~ askBid: ~ gerSellOrders:", gerSellOrders);
      console.log("🚀 -------------------------------------------🚀");

      if (gerBuyOrders === null && gerSellOrders === null) {
        console.log("Ask And Bid data not Found");
        return res.send({
          status: "fail",
          message: "Ask And Bid data not Found",
        });
      } else {
        if (gerBuyOrders == null || gerSellOrders == null) {
          return res.send({
            status: "fail",
            message: "Added to Bid,Orders Not Matched",
          });
        } else {
          if (gerBuyOrders.price === gerSellOrders.price) {
            console.log("order match", {
              buy: gerBuyOrders.price,
              sell: gerSellOrders.price,
            });
            console.log("set new price", gerBuyOrders.price);

            //  update quntity
            let findBuy = await limitOrder
              .findOne({
                orderType: gerBuyOrders.orderType,
              })
              .sort({ price: "descending" });

            let findSell = await limitOrder
              .findOne({
                orderType: gerSellOrders.orderType,
              })
              .sort({ price: "descending" });

            console.log("findBuy", findBuy.price);
            console.log("findSell", findSell.price);

            updatePrice({
              coinsyml: findBuy.coinsyml,
              newprice: findBuy.price,
            });

            buyStockApi({
              username: findBuy.username,
              coinsyml: findBuy.coinsyml,
              Amount: findBuy.Quantity * findBuy.price,
              orderType: findBuy.orderType,
            });
            console.log("QuntityBuy", findBuy.Quantity * findBuy.price);

            sellStockApi({
              username: findSell.username,
              coinsyml: findSell.coinsyml,
              Amount: findBuy.Quantity * findSell.price,
              orderType: findSell.orderType,
            });

            // updatePrice({
            //   coinsyml: findBuy.coinsyml,
            //   newprice: findBuy.price,
            // });

            let placeBuy = await limitOrder.findOneAndUpdate(
              { orderType: gerBuyOrders.orderType },
              { Quantity: findBuy.Quantity - findBuy.Quantity },
              { new: true }
            );

            let placeSell = await limitOrder.findOneAndUpdate(
              { price: findSell.price },
              { Quantity: findSell.Quantity - findBuy.Quantity },
              { new: true }
            );

            let BidfindDelete = await limitOrder
              .find({ Quantity: 0 })
              .deleteMany();

            return res.send({
              status: "success",
              message: "Orders matched From(if) Same Price",
            });
          } else {
            let findBuy2 = await limitOrder
              .findOne({
                orderType: gerBuyOrders.orderType,
              })
              .sort({ price: "descending" });
            console.log("🚀 ---------------------------------🚀");
            console.log("🚀 ~ askBid: ~ findBuy2:", findBuy2);
            console.log("🚀 ---------------------------------🚀");

            let findSell2 = await limitOrder
              .findOne({
                price: gerBuyOrders.price,
                orderType: gerSellOrders.orderType,
              })
              .sort({ price: "descending" });
            console.log("else order match", {
              elsebuy: findBuy2.price,
              elsesell: findSell2.price,
            });

            console.log("findBuy", findBuy2.price);
            console.log("findSell", findSell2.price);
            
            updatePrice({
              coinsyml: findBuy2.coinsyml,
              newprice: findBuy2.price,
            });

            buyStockApi({
              username: findBuy2.username,
              coinsyml: findBuy2.coinsyml,
              Amount: findBuy2.Quantity * findBuy2.price,
              orderType: findBuy2.orderType,
            });

            sellStockApi({
              username: findSell2.username,
              coinsyml: findSell2.coinsyml,
              Amount: findBuy2.Quantity * findSell2.price,
              orderType: findSell2.orderType,
            });

            // updatePrice({
            //   coinsyml: findBuy2.coinsyml,
            //   newprice: findBuy2.price,
            // });

            let placeBuy = await limitOrder.findOneAndUpdate(
              { orderType: gerBuyOrders.orderType },
              { Quantity: findBuy2.Quantity - findBuy2.Quantity },
              { new: true }
            );

            let placeSell = await limitOrder.findOneAndUpdate(
              { price: findSell2.price },
              { Quantity: findSell2.Quantity - findBuy2.Quantity },
              { new: true }
            );

            let BidfindDelete = await limitOrder
              .find({ Quantity: 0 })
              .deleteMany();

            return res.send({
              status: "Orders matched From Ask List",
              sell: placeSell.price,
            });
          }
        }
      }
    } catch (error) {
      console.log(error);
      res.send({ status: "failAs", message: error.message });
    }
  },
  viewAsk: async (req, res) => {
    let { coinsyml } = req.body;
    // console.log("ask Hit value",coinsyml);
    // will take coin name with params

    // Bid=Buyer Ask=seller
    try {
      // let  gerBuyOrders=await limitOrder.findOne({orderType: "Bid"}).sort({price:"descending"})
      let gerSellOrders = await limitOrder
        .find({ orderType: "Ask", coinsyml: coinsyml })
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
    let { coinsyml } = req.body;
    // console.log("Bid Hit value",coinsyml);

    // will take coin name with params

    // Bid=Buyer Ask=seller
    try {
      // let  gerBuyOrders=await limitOrder.findOne({orderType: "Bid"}).sort({price:"descending"})
      let gerSellOrders = await limitOrder
        .find({ orderType: "Bid", coinsyml: coinsyml })
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
  getBtcBalance: async (req, res) => {
    let { username } = req.body;
    try {
      let btcBal = await porfolioModel.findOne({
        username: username,
        coinsyml: "btc",
      });
      if (btcBal === null) {
        return res.send({ status: "fail", message: "no btc Found" });
      }
      return res.send(btcBal);
    } catch (error) {
      res.send({ status: "fail", message: error.message });
    }
  },

  swapBuy: async (req, res) => {
    try {
      let { username, Fromcoinsyml,Tocoinsyml,ToPrice,Amount } = req.body;

      let stock = await stockModel.find({ coinsyml: Fromcoinsyml });
      let wallet = await walletModel.find({ username: username });

      let portfolioCheck = await porfolioModel.find({
        username: username,
        coinsyml: Fromcoinsyml,
      });
      console.log("🚀 ----------------------------------------------🚀")
      console.log("🚀 ~ swapBuy: ~ portfolioCheck:", portfolioCheck)
      console.log("🚀 ----------------------------------------------🚀")

      let SwapPortfolioCheck = await porfolioModel.find({
        username: username,
        coinsyml: Tocoinsyml,
      });
      console.log("🚀 ------------------------------------------------------🚀")
      console.log("🚀 ~ swapBuy: ~ SwapPortfolioCheck:", SwapPortfolioCheck)
      console.log("🚀 ------------------------------------------------------🚀")

      const updatePortfolio = async (amountReduce) => {
        let update = await porfolioModel.findOneAndUpdate(
          { username: username, coinsyml: Fromcoinsyml },
          { Quantity: portfolioCheck[0].Quantity - amountReduce },
          { new: true }
        );
      };
     
      if (portfolioCheck[0].Quantity <= 0 || Amount > portfolioCheck[0].Quantity) {
        return res.send({
          status: "failed",
          message: `Insufficient ${Fromcoinsyml} ! Please Add Funds`,
        });
      }
      
      else if (SwapPortfolioCheck.length > 0) {
        let swapUpdate = await porfolioModel.findOneAndUpdate(
          { username: username, coinsyml: Tocoinsyml },
          {
            buyPrice: ToPrice, //avg
            Quantity: SwapPortfolioCheck[0].Quantity + Amount / ToPrice,
            value:
            SwapPortfolioCheck[0].value +
              (Amount / ToPrice) * ToPrice,
          },
          { new: true }
        );
        updatePortfolio(Amount);
       
        return res.send({
          status: "success",
          message: `Stock Swap Qunt:${Amount / ToPrice} Succefully!`,

          swapUpdate,
        });
      }
      else {
        let newportfolio = new porfolioModel({
          username: username,
          coinsyml: Tocoinsyml,
          buyPrice: ToPrice,
          Quantity: Amount / ToPrice,
          value: (Amount / ToPrice) * ToPrice,
        });
        let newSaved = await newportfolio.save();
        updatePortfolio(Amount);
    }
    }
     catch (error) {
      console.log(error);
      res.send({ status: "fail", message: error.message });
    }
  },
};
