const mongoose = require("mongoose");
const Admin = require("../models/admin");
const Labtest = require("../models/Labtest");
//add to cart lab test
const cartTestschema = mongoose.Schema({
  
    Testname: {
      type: String,
    },
    Testprice: {
      type: String,
  
    },
    TestDetail: {
      type: String,
    },
    Discount:{
      type: Number,
      default: 0,
    },
 TestId: {
      type: String,
      
      
    },
   
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "Admin",
      required: true,
    },
    quantity: {
      type: Number,
      default: 1, // Initialize quantity to 1
    },
    
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  module.exports = mongoose.model("AddCart", cartTestschema);
  
