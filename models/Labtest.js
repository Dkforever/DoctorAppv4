const mongoose = require("mongoose");
const Admin = require("../models/admin");

const TestSchema = mongoose.Schema({

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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


module.exports = mongoose.model("Labtest", TestSchema);



