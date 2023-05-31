require("dotenv").config();
const mongoose = require("mongoose");

const connectToMongo=()=>{
    try {
        mongoose.connect(process.env.mongo_url);
        console.log("Connected to Mongo");
    } catch (error) {
        console.log(error);
    }
}


module.exports=connectToMongo;