require("dotenv").config();
const mongoose = require("mongoose");

// const connectToMongo=()=>{
//     try {
//         mongoose.connect(process.env.mongo_url);
//         console.log("Connected to Mongo");
//     } catch (error) {
//         console.log(error);
//     }
// }

// DATABASE
const DB = process.env.MONGO_URI.replace(
    "<password>",
    process.env.MONGO_PASSWORD
);
  
const connectToMongo=async()=>{ 
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
      // useFindAndModify: false,
    })
    .catch((err) => console.log(err));
}

module.exports=connectToMongo;