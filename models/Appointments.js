const mongoose = require("mongoose");
const Admin = require("../models/admin");

const appointmentSchema = mongoose.Schema({
  doctor: {
    type: mongoose.Schema.ObjectId,
    ref: "Doctor",
    required: true,
  },


  time: {
    type: String,
  },
  day: {
    type: String,

  },
  clinicname: {
    type: String,
  },
  address: {
    type: String,
  },
  city: {
    type: String
  },

  // which admin created this Campaign

  prescription: {
    type: String,
    default: "yet to write"
  },

  reports: [
    {
      reportimg: {
        type: String,
        required:true,
        default: "ImageURL"
      },
      reportname: {
        type: String,
        required:'true',
         default: "Xray"
      },
    },
  ],
  
  PrescribedAt: {
    type: Date,
  },

  status: {
    type: String,
    default: "pending",
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "Admin",
    required: true,
  },
  patient: {
    type: String,
    required: true
  },
  mobile: {
    type: Number,
  },

  // images: [
  //   {
  //     public_id: String,
  //     required: false,
  //     url: String,
  //   },
  // ],

  // reviews: [
  //   {
  //     customer: {
  //       type: mongoose.Schema.ObjectId,
  //       ref: "Customer",
  //       required: false,
  //     },
  //     firstname: {
  //       type: String,
  //       required: false,
  //     },
  //     rating: {
  //       type: Number,
  //       required: false,
  //     },
  //     comment: {
  //       type: String,
  //       required: false,
  //     },
  //   },
  // ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Appoinment", appointmentSchema);