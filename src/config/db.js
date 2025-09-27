// require('dotenv').config();
const mongoose = require("mongoose");

const connectDb = async ()=>{

    try{
        
      const conn =  await mongoose.connect(process.env.MONGO_URI);
         console.log(`MongoDB Connected: ${conn.connection.name}`);
    } catch(error){

         console.log('MongoDB connection failed:', error.message);
        process.exit(1);  // Exit the app if DB fails
    }
};

module.exports = connectDb;