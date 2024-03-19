const mongoose = require("mongoose");


 const connectDatabase = async() =>{
  mongoose.set('strictQuery', true);
  try{
    const {connection} = await mongoose.connect(process.env.MONGO_URI, );
    console.log(`MongoDB is connected on : ${connection.host}`);
  } catch(error){
    console.log(error);
  }
}

module.exports = connectDatabase;