const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Admin = require("../models/admin");

const firebaseAdmin = require('firebase-admin');
const serviceAccount = require('../doctorapp-d8c9f-firebase-adminsdk-xv62w-31f19733a4.json');

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
   databaseURL: 'https://doctorapp-d8c9f-default-rtdb.firebaseio.com/', // Replace with your Firebase project URL
});


const sendToken = require("../utils/jwToken");
const { uploader1 } = require("../ImageUpload");
//const sendEmail = require("../utils/sendEmail");
//const crypto = require("crypto");
//const cloudinary = require("cloudinary");

//twilio
// const accountSid = 'AC8d8112842619f83b4aeb83385b209332';
// const authToken = 'da0f72ce2fd0912d773ad9b8139675c7';

// const client = require('twilio')(accountSid, authToken);

exports.patient = catchAsyncErrors(async(req,res,next) =>{
  const patient = await Admin.find()
  
  res.status(200).json(
     
       patient,
    );
  })

exports.registerAadmin = catchAsyncErrors(async (req, res, next) => {
 
  const { name,mobile, email, password, role ,gender,blood,dob,height,weight,address} = req.body;

// // Generate an OTP using Firebase Auth
// let digits = "0123456789";
// otp = "";
// for(let i =0;i<4;i++){
// otp +=digits[Math.floor(Math.random() * 10)];
// }


 const countryCode = "+91";
 const phoneNumber = `${countryCode}${mobile}`;
const phoneCredential = await firebaseAdmin.auth().createUser({
  phoneNumber:phoneNumber,
  password:password,
});

// const otp = phoneCredential.toJSON().passwordHash.substring(0, 6);
 const otp = phoneCredential.uid.substring(0, 6);

 
//Twilio Trial
// client.messages
//     .create({
//         body: otp,
//         from: '+14849929481',
//         to: phoneNumber,
//     })
//     .then(message => console.log(message.sid))
  


  const admin = await Admin.create({
    name,
    mobile,
    email,
    gender,
    blood,
    dob,
    height,
    weight,
    password,
    role,
    address,
    otp, 
  });

  // twilio
  // client.messages
  // .create({
  //     body: 'Dhiraj Ram',
  //     from: '+14849929481',
  //     to: phoneNumber,
  // })
  // .then(message => console.log(message.sid))


  sendToken(admin, 201, res);
});



// Login User
// exports.loginAdmin = catchAsyncErrors(async (req, res, next) => {
//   const { email ,mobile, password } = req.body;

//   // checking if user has given password and email both

//   if (!email  || !password) {
//     return next(new ErrorHandler("Please Enter Email & Password", 400));
//   }

//   const admin = await Admin.findOne({ email }).select("+password");

//   if (!admin) {
//     return next(new ErrorHandler("Invalid email or password", 401));
//   }

//   const isPasswordMatched = await admin.comparePassword(password);

//   if (!isPasswordMatched) {
//     return next(new ErrorHandler("Invalid email or password", 401));
//   }


//   sendToken(admin, 200, res);
// });




//try if emai or mobile any input
exports.loginAdmin = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // Checking if the user has provided the email (mobile or email) and password
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }

  let admin;
  if (email.includes("@")) {
    // If the email contains "@" symbol, consider it as an email
    admin = await Admin.findOne({ email: email }).select("+password");
  } else {
    // Otherwise, consider it as a mobile number
    admin = await Admin.findOne({ mobile: email }).select("+password");
  }

  if (!admin) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await admin.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(admin, 200, res);
});






exports.adminLogout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});



exports.PatientMyprofile = catchAsyncErrors(async (req, res, next) => {
  const profile = await Admin.findOne({ _id: req.admin._id });
 
  res.status(200).json(
  //  success: true,
    profile,
  );
});



exports.ViewPatientMyprofile = catchAsyncErrors(async (req, res, next) => {
  const Patient = await Admin.findById(req.params.id);

  res.status(200).json(
  //  success: true,
    Patient,
  );
});

// exports.PatientMyprofile = catchAsyncErrors(async (req, res, next) => {
//   const profile = await Admin.findOne({ _id: req.admin._id });
 
//   res.status(200).json(
//     // success: true,
//     profile,
// );
// });


// update Admin Profile
exports.updateAdminProfile = catchAsyncErrors(async (req, res, next) => {
  const newAdminData = {
    name: req.body.name,
    email: req.body.email,
    mobile: req.body.mobile,
    gender:req.body.gender,
    blood:req.body.blood,
    dob:req.body.dob,
    height:req.body.height,
    weight:req.body.weight,
    address: req.body.address,
    role: req.body.role,
  };

  
  const admin = await Admin.findByIdAndUpdate(req.params.id, newAdminData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    res : admin,
  });
});


// exports.updateAdminProfile = catchAsyncErrors(async (req, res, next) => {
//   const uploadSingle = uploader1().single("file");
//   uploadSingle(req, res, async (err) => {
//     if (err) {
//       return res.status(400).json({ error: err.message });
//     }

//     if (!req.file) {
//       return res.status(400).json({ error: "No file was uploaded." });
//     }

//     const avatar = req.file.location;

//     const newAdminData = {
//       name: req.body.name,
//       email: req.body.email,
//       mobile: req.body.mobile,
//       gender: req.body.gender,
//       blood: req.body.blood,
//       dob: req.body.dob,
//       height: req.body.height,
//       weight: req.body.weight,
//       address: req.body.address,
//       role: req.body.role,
//       avatar: avatar,
//     };

//     try {
//       const admin = await Admin.findByIdAndUpdate(
//         req.params.id,
//         newAdminData,
//         { new: true, runValidators: true, useFindAndModify: false }
//       );

//       res.status(200).json({
//         success: true,
//         res: admin,
//       });
//     } catch (error) {
//       return res.status(500).json({ error: "Internal Server Error" });
//     }
//   });
// });







exports.updateProfilePic = catchAsyncErrors(async (req, res, next) => {
  const uploadSingle = uploader1().single("file");
  uploadSingle(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file was uploaded." });
    }

    const avatar = req.file.location;

    const newAdminData = {
      name: req.body.name,
     
      avatar: avatar,
    };

    try {
      const admin = await Admin.findByIdAndUpdate(
        //  req.params.id,
         req.admin.id,
        newAdminData,
        { new: true, runValidators: true, useFindAndModify: false }
      );

      res.status(200).json({
        success: true,
        res: admin,
      });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
});






// Delete User --Admin
exports.deleteAdmin = catchAsyncErrors(async (req, res, next) => {
  const admin = await Admin.findById(req.params.id);

  if (!admin) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400)
    );
  }

  
  await admin.remove();

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});





exports.SearchPatient = catchAsyncErrors(async (req, res, next) => {
  const searchKey = req.query.searchKey; // Access the 'searchKey' query parameter

  if (searchKey !== undefined && searchKey !== null) {
    const searchStr = searchKey.toString(); // Convert searchKey to a string

    let result = await Admin.find({
      $or: [
        { name: { $regex: searchStr, $options: 'i' } },
        { email: { $regex: searchStr, $options: 'i' } },
        { mobile: { $regex: searchStr, $options: 'i' } },
        { 'address.area': { $regex: searchStr, $options: 'i' } },
        { 'address.city': { $regex: searchStr, $options: 'i' } },
      ],
    });

    res.status(200).json(result);
  } else {
    res.status(400).json({ message: 'Invalid search key' });
  }
});




