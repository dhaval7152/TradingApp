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
  console.log("🚀 ~ buy ~ res:", res);
  console.log("🚀 -------------------🚀");

  if (res.status === "failed") {
    // alert(res.message)
    console.log("res.message");

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
      coinsyml: "xrp", //dyanamic pass coinsyml
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
    let { username, coinsyml, Amount } = req.body;
    let stock = await stockModel.find({ coinsyml: coinsyml });
    // console.log("🚀 -----------------------------🚀");
    // console.log("🚀 ~ buyStock: ~ stock:", stock);
    // console.log("🚀 -----------------------------🚀");
    let wallet = await walletModel.find({ username: username });


    let portfolioCheck = await porfolioModel.find({ username: username ,coinsyml:coinsyml});


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
      return res.send({ status: "failed", message: "Please Add Funds" });
    }

    // Use OG
    if (stock[0].Quantity < 0 || Amount / stock[0].price > stock[0].Quantity) {
      return res.send({ status: "failed", message: "All Stock Sold" });
    } else if (portfolioCheck.length > 0) {
      // console.log("matched");
      updateBalance(Amount);
      // console.log("portfolioCheck.length > 0");

      let buyUpdate = await porfolioModel.findOneAndUpdate(
        { username: username,coinsyml:coinsyml },
        {
          buyPrice: stock[0].price, //avg
          Quantity: portfolioCheck[0].Quantity + Amount / stock[0].price,
          value:
            portfolioCheck[0].value +
            (Amount / stock[0].price) * stock[0].price,
        },
        { new: true }
      );
      console.log("🚀 -------------------------------------🚀")
      console.log("🚀 ~ buyStock: ~ buyUpdate:", buyUpdate)
      console.log("🚀 -------------------------------------🚀")

      let newbuyUpdate = await buyUpdate.save();
      updateStock(newbuyUpdate.Quantity);
      console.log("🚀 -------------------------------------------🚀");
      console.log("🚀 ~ buyStock: ~ newbuyUpdate:", newbuyUpdate);
      console.log("🚀 -------------------------------------------🚀");

      console.log("🚀 -------------------------------------------🚀");
      console.log("🚀 ~ newbuyUpdate.Quantity:", newbuyUpdate.Quantity);
      console.log("🚀 -------------------------------------------🚀");
      // return res.send({test:"test"})
      return res.send({status:"success",message:"Stock Added Succefully!",newbuyUpdate});
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

      return res.send({status:"success",message:"Stock Buyed Succefully!",newSaved});
    }
    }
    catch (error) {
      console.log(error);
      res.send({ status: "fail", message: error.message });
    }
  },
  sellStock: async (req, res) => {
    // condition: walllet balance increase
    // quanity plus to stocks

    let { username, coinsyml, Amount } = req.body;
    try {

    let stock = await stockModel.find({ coinsyml: coinsyml });

    let wallet = await walletModel.find({ username: username });

    let portfolioCheck = await porfolioModel.find({ username: username,coinsyml:coinsyml });

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
        // updateBalance(Amount);
        // console.log("matched");

        let sellUpdate = await porfolioModel.findOneAndUpdate(
          { username: username,coinsyml:coinsyml },
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
        // updateStock(Amount / stock[0].price);
        updateBalance(Amount / stock[0].price);

         console.log("user wallet update", Amount / stock[0].price);
        console.log("🚀 -------------------------------------------🚀");
        console.log("🚀 ~ buyStock: ~ newbuyUpdate:", newsellUpdate);
        console.log("🚀 -------------------------------------------🚀");
        return res.send({ status: "success",message:`${stock[0].CoinkName} Quantity ${Amount / stock[0].price} Sold Succefully`,newsellUpdate});
      }
      
      else {
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
    console.log("limitOrder",data);

    try {
      if(data.orderType==="Bid"){
      
        let createOrder = new limitOrder(data);
        let newcreateOrder = await createOrder.save();
        return res.send(newcreateOrder);
      }
      let portfolioCheck = await porfolioModel.find({
        username: data.username,
        coinsyml: data.coinsyml,
      });
      console.log("🚀 -------------------------------------------------🚀")
      console.log("🚀 ~ limitOrder: ~ portfolioCheck:", portfolioCheck)
      console.log("🚀 -------------------------------------------------🚀")
     console.log("portfolioCheck",portfolioCheck);
     if(portfolioCheck.length===0){
      return res.send({
        status: "fail",
        message: "You Don't Have any stocks To Ask",
      });
     }
    if(!portfolioCheck.length===0){
      if (data.Quantity > portfolioCheck[0].Quantity) {
        return res.send({
          status: "fail",
          message: "You Don't Have any stocks To Ask",
        });
      }
    }
    else{

      let createOrder = new limitOrder(data);
      let newcreateOrder = await createOrder.save();
      return res.send(newcreateOrder);
    }


    } catch (error) {
      res.send({ status: "fail", message: error.message });
    }
  },
  askBid: async (req, res) => {
    let {coinsyml} = req.body;
    let data = req.body;
    console.log("🚀 ---------------------------------🚀")
    console.log("🚀 ~ askBid: ~ data:", data)
    console.log("🚀 ---------------------------------🚀")

    console.log("hitting askBid from backend");
    // Bid=Buyer Ask=seller
    try {
      let gerBuyOrders = await limitOrder
        .findOne({ orderType: "Bid",coinsyml:coinsyml })
        .sort({ price: "descending" });
      console.log("🚀 -----------------------------------------🚀")
      console.log("🚀 ~ askBid: ~ gerBuyOrders:", gerBuyOrders)
      console.log("🚀 -----------------------------------------🚀")

   
      let gerSellOrders = await limitOrder
        .findOne({ orderType: "Ask",coinsyml:coinsyml })
        .sort({ price: "descending" });
      console.log("🚀 -------------------------------------------🚀")
      console.log("🚀 ~ askBid: ~ gerSellOrders:", gerSellOrders)
      console.log("🚀 -------------------------------------------🚀")
      

      if (gerBuyOrders === null && gerSellOrders === null) {
        console.log("Ask And Bid data not Found");
        return res.send({ status: "fail", message: "Ask And Bid data not Found" });
      } else {
        
        if (gerBuyOrders == null || gerSellOrders == null) {
          
          return res.send({ status: "fail", message: "Added to Bid,Orders Not Matched" });
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

            buyStockApi({
              username: findBuy.username,
              coinsyml: findBuy.coinsyml,
              Amount: findBuy.Quantity * findBuy.price,
            });

            sellStockApi({
              username: findSell.username,
              coinsyml: findSell.coinsyml,
              // Amount: findBuy.Quantity * findBuy.price,
              Amount: findBuy.Quantity * findSell.price,
            });

            // updatePrice(findBuy.price);

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

            // return res.send({ newPrice: gerBuyOrders.price });
            return res.send({
              status:"success",
              message: "Orders matched From(if) Same Price"
            });
          } else {
            let findBuy2 = await limitOrder
              .findOne({
                orderType: gerBuyOrders.orderType,
              })
              .sort({ price: "descending" });
            console.log("🚀 ---------------------------------🚀")
            console.log("🚀 ~ askBid: ~ findBuy2:", findBuy2)
            console.log("🚀 ---------------------------------🚀")

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

            buyStockApi({
              username: findBuy2.username,
              coinsyml: findBuy2.coinsyml,
              Amount: findBuy2.Quantity * findBuy2.price,
            });


            updatePrice(findBuy2.price);

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

            return res.send({ status: "Orders matched From Ask List",sell:placeSell.price});
          }
        }
      }
    } catch (error) {
      console.log(error);
      res.send({ status: "failAs", message: error.message });
    }
  },
  viewAsk: async (req, res) => {
    let {coinsyml} =req.body;
    // console.log("ask Hit value",coinsyml);
// will take coin name with params

    // Bid=Buyer Ask=seller
    try {
      // let  gerBuyOrders=await limitOrder.findOne({orderType: "Bid"}).sort({price:"descending"})
      let gerSellOrders = await limitOrder
        .find({ orderType: "Ask",coinsyml:coinsyml })
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
    let {coinsyml} =req.body;
    // console.log("Bid Hit value",coinsyml);


// will take coin name with params

    // Bid=Buyer Ask=seller
    try {
      // let  gerBuyOrders=await limitOrder.findOne({orderType: "Bid"}).sort({price:"descending"})
      let gerSellOrders = await limitOrder
        .find({ orderType: "Bid" ,coinsyml:coinsyml})
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
