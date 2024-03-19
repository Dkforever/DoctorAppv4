const mongoose = require('mongoose');
const validator = require("validator");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
// const crypto = require("crypto");


const doctorSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [3, "Name should have more than 3 characters"],
  },
  specialist: {
    type: String,
    required: [true, "Please Enter Your Specialist"],
    maxLength: [30, "Specialist cannot exceed 30 characters"],
    minLength: [4, "specialist should have more than 4 characters"],
    default:"General Physician"
  },

  experience:{
    type: Number,
    default:2,
  },
 
  mobile: {
    type: String,
    minLength: [10, "Mobile number should be 10 characters"]
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter a valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minLength: [8, "Password should be greater than 8 characters"],
    select: false,
  },
  role: {
    type: String,
    default: "doctor",
  },
  fee:{
    type:Number,
    default: 0,
  },
 avatar:{
  type:String,
  
 },

  address: {
    area: {
      type: String
    },
    landMark: {
      type: String
    },
    city: {
      type: String,
      minLength: [3, "City name shoudl be more than 3 character"]
    },
    state: {
      type: String,
      default: "west bengal "
    },
    pinCode: {
      type: String
    },
  },

  numOfClinics:{
    type:Number,
    default: 0,
  },
  // Clinics Array 
  clinics: [
    {
      clinicname: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      city:{
        type: String,
        required:true,
      },
      time: {
        type:String,
        required: false,
        default:'0'
      },
      timeEnd:{
     type: String,
     required:true
     
      },
      gap:{
        type:Number,
        required:'true'
      },
      day: {
        type: String,
        required: false,
      },
      cliniclocation:{
        latitude: Number,
        longitude: Number,
      }
    },
  ],
  //cclinic end


  createdAt: {
    type: Date,
    default: Date.now,
  },

  ratings: {
    type: Number,
    default: 0
  },

  numOfReviews:{
    type: Number,
    default: 0
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "Admin",
        required: false,
      },
      name: {
        type: String,
        required: false,
      },
      rating: {
        type: Number,
        // required: false,
        // default: 2
      },
      comment: {
        type: String,
        required: false,
      },
    },
  ],

});





doctorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// JWT TOKEN
doctorSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//Compare Password

doctorSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};



module.exports = mongoose.model("Doctor", doctorSchema);