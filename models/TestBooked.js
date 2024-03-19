const mongoose = require("mongoose");
const Admin = require("../models/admin");
const Labtest = require("../models/Labtest");
//add to cart lab test
const BookedTestschema = mongoose.Schema({

    // userId: {
    //     type: mongoose.Schema.ObjectId,
    //     ref: "Admin",
    //     //  required: true,
    // },
    status:{
        type: String,
        default:"pending",
    },
    Patientname:{
        type: String,

    },
    Address:{
        type: String,
    },
    mobilenumber:{
        type : String,
    },
    prescriptionpic:{
        type:String,
        //  required: true,
         default:"ImageUrl"
      },
    
    bookedTests: [
        {
            testId: {
                type: mongoose.Schema.ObjectId,
                ref: 'Labtest', // Reference to a Test model representing the test to be booked
                //  required: true,
            },
            Testname: {
                type: String,
            },
            Testprice: {
                type: String,

            },
            Discount:{
                type: Number,
                default: 0, 
            },
            
            TestDetail: {
                type: String,
            },

            quantity: {
                type: Number,
                default: 1, // Initialize quantity to 1
            },

            createdAt: {
                type: Date,
                default: Date.now,
            },
        }]
});

module.exports = mongoose.model("Testbooked", BookedTestschema);

