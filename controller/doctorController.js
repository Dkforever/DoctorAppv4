const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
//const Admin = require("../models/admin");
const Doctor = require("../models/doctor")
const sendToken = require("../utils/jwToken");
const { upload, uploader1 } = require("../ImageUpload");
//const sendEmail = require("../utils/sendEmail");
//const crypto = require("crypto");
//const cloudinary = require("cloudinary");



exports.doctors = catchAsyncErrors(async(req,res,next) =>{
const doctor = await Doctor.find()
//let arr = Array.from(doctor)
res.status(200).json(

   //success: true,
  doctor,


  );
})

exports.registerDoctor = catchAsyncErrors(async (req, res, next) => {
  
  const { name,mobile, email, password,specialist,fee,experience ,role,address ,clinics} = req.body;

  const doctor = await Doctor.create({
    name,
    mobile,
    email,
    specialist,
    password,
    fee,
    experience,
    role,
    address,
    clinics,

   
  });
  sendToken(doctor, 201, res);
});

// Login Doctor
// exports.loginDoctor = catchAsyncErrors(async (req, res, next) => {
//   const { email, password } = req.body;

//   // checking if user has given password and email both

//   if (!email || !password) {
//     return next(new ErrorHandler("Please Enter Email & Password", 400));
//   }

//   const doctor = await Doctor.findOne({ email }).select("+password");

//   if (!doctor) {
//     return next(new ErrorHandler("Invalid email or password", 401));
//   }

//   const isPasswordMatched = await doctor.comparePassword(password);

//   if (!isPasswordMatched) {
//     return next(new ErrorHandler("Invalid email or password", 401));
//   }


//   sendToken(doctor, 200, res);
// });


//Login with eith email or Phone number
exports.loginDoctor = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if user has given password and email both

  let doctor;
  if (email.includes("@")) {
    // If the email contains "@" symbol, consider it as an email
    doctor = await Doctor.findOne({ email: email }).select("+password");
  } else {
    // Otherwise, consider it as a mobile number
    doctor = await Doctor.findOne({ mobile: email }).select("+password");
  }

  if (!doctor) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

   const isPasswordMatched = await doctor.comparePassword(password);
   
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }


  sendToken(doctor, 200, res);
});




exports.doctorLogout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});




exports.myprofile = catchAsyncErrors(async (req, res, next) => {
  const profile = await Doctor.findOne({ _id: req.doctor._id });
 
  res.status(200).json(
    // success: true,
    profile,
  );
});



// exports.DoctorSearch = catchAsyncErrors(async (req, res, next) => {
//   const searchKey = req.params.key;
//   const isNumber = /^\d+$/.test(searchKey); // Check if the searchKey is a number

//   let doctor;
//   if (isNumber) {
//     doctor = await Doctor.find({
//       mobile: Number(searchKey) // Convert the searchKey to a number
//     });
//   } else {
//     doctor = await Doctor.find({
//       $or: [
//         { name: { $regex: searchKey, $options: 'i' } },
//         { email: { $regex: searchKey, $options: 'i' } },
//         { city: { $regex: searchKey, $options: 'i' } },
//         { specialist: { $regex: searchKey, $options: 'i' } },
//         { clicnics: { $regex: searchKey, $options: 'i' } },
//       ]
//     });
//   }

//   // Rest of your code to handle the search results and send the response
//   res.status(200).json(doctor);
// });




exports.DoctorSearch = catchAsyncErrors(async (req, res, next) => {
  const searchKey = req.params.key;
  const isNumber = /^\d+$/.test(searchKey); // Check if the searchKey is a number

  let result;
  if (isNumber) {
    result = await Doctor.find({ mobile: Number(searchKey) });
  } else {
    result = await Doctor.find({
      $or: [
        { name: { $regex: searchKey, $options: 'i' } },
        { email: { $regex: searchKey, $options: 'i' } },
        { specialist: { $regex: searchKey, $options: 'i' } },
        { 'address.area': { $regex: searchKey, $options: 'i' } },
        { 'address.city': { $regex: searchKey, $options: 'i' } },
        { 'clinics.clinicname': { $regex: searchKey, $options: 'i' } },
        { 'clinics.address': { $regex: searchKey, $options: 'i' } },
        { 'clinics.city': { $regex: searchKey, $options: 'i' } },
       ]
    });
  }

  res.status(200).json(result);
});




//its working but need more modification

// exports.DoctorSearch2 = catchAsyncErrors(async (req, res, next) => {
//   const search = req.query.search || "";
//   const city = req.query.city || "";
//   const specialist = req.query.specialist || "";
//   const sp = req.query.sp || "";
//   let sort = req.query.sort || "ratings";

//   req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

//   let sortBy = {};
//   if (sort[1]) {
//     sortBy[sort[0]] = sort[1];
//   } else {
//     sortBy[sort[0]] = 1; // Use 1 for ascending order by default
//     sortBy["ratings"] = -1; // Sort by "ratings" field in descending order (-1)
//   }

//   let query = {};

//   if (search || city || specialist||sp) {
//     query = {
//       $and: [
//         search ? { name: { $regex: search, $options: "i" } } : {},
//          sp ? { specialist: { $regex: search, $options: "i" } } : {},
//         city ? { "address.city": { $regex: city, $options: "i" } } : {},
//         specialist ? { specialist: { $regex: specialist, $options: "i" } } : {}
//       ]
//     };
//   }

//   const doctor = await Doctor.find(query)
//     .sort(sortBy);

//   res.status(200).json(doctor);
// });




//Better one With al lfileds
exports.DoctorSearch2 = catchAsyncErrors(async (req, res, next) => {
  const search = req.query.search || "";
  const city = req.query.city || "";
  const specialist = req.query.specialist || "";
  const sp = req.query.sp || "";
  let sort = req.query.sort || "ratings";

  req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

  let sortBy = {};
  if (sort[1]) {
    sortBy[sort[0]] = sort[1];
  } else {
    sortBy[sort[0]] = 1; // Use 1 for ascending order by default
    sortBy["ratings"] = -1; // Sort by "ratings" field in descending order (-1)
  }

  let query = {};

  if (search || city || specialist || sp) {
    query = {
      $and: [
        search ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { specialist: { $regex: search, $options: "i" } }
          ]
        } : {},
        city ? { "address.city": { $regex: city, $options: "i" } } : {},
        specialist ? { specialist: { $regex: specialist, $options: "i" } } : {},
        sp ? { fieldName: { $regex: sp, $options: "i" } } : {} // Replace "fieldName" with the actual field you want to search for using the "sp" value
      ],
    };
  }

  const doctor = await Doctor.find(query)
    .sort(sortBy);

  res.status(200).json(doctor);
});



//END Doctror Seach Filter here





// update Doctor Profile
exports.updateDoctorProfile = catchAsyncErrors(async (req, res, next) => {
  const newDoctorData = {
    name: req.body.name,
    mobile: req.body.mobile,
    fee: req.body.fee,
    specialist: req.body.specialist,
    
    experience: req.body.experience,
    email: req.body.email,
    address: req.body.address
  };

  
  const doctor = await Doctor.findByIdAndUpdate(req.params.id, newDoctorData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    res : doctor,
  });
});



//Update Doctor Profile Pic

exports.updateDoctorPic = catchAsyncErrors(async (req, res, next) => {
 
  const uploadSingle = uploader1().single("file");
  uploadSingle(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file was uploaded." });
    }

    const avatar = req.file.location;
 
  const newDoctorData = {
    address: req.body.address,
    avatar: avatar,
  };

  try{
  const doctor = await Doctor.findByIdAndUpdate(req.doctor.id, newDoctorData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    res : doctor,
  });
}
catch(error){
  return res.status(500).json({error:"internal Server Error"})
}
  });
});










//Add Clinic by Doctor Self
// Add doctor More Clinic
exports.createClinic= catchAsyncErrors(async (req, res, next) => {
  const { clinicname, address,time, day,city,timeEnd ,gap,cliniclocation} = req.body;

  const clinic = {
    clinicname,
    address,
    time,
    timeEnd,
    day,
    city,
    gap,
    cliniclocation
  
  };

  const doctor = await Doctor.findById({_id: req.doctor._id});
 
    doctor.clinics.push(clinic);

  await doctor.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});







 
//  // Add doctor More Clinic
// exports.createClinic= catchAsyncErrors(async (req, res, next) => {
//   const { clinicname, address,time, day,city,doctorId } = req.body;

//   const clinic = {
//     clinicname,
//     address,
//     time,
//     day,
//     city,
  
//   };

//   const doctor = await Doctor.findById(doctorId);
 
//     doctor.clinics.push(clinic);

//   await doctor.save({ validateBeforeSave: false });

//   res.status(200).json({
//     success: true,
//   });
// });

//get All clinic
exports.getMyClinic = catchAsyncErrors(async (req, res, next) => {
  const doctor = await Doctor.findById({_id:req.doctor._id});

  if (!doctor) {
    return next(new ErrorHandler("Doctor not found", 404));
  }

  res.status(200).json(

     doctor.clinics,
  
    // success: true,
  );
});



//get All clinic of a by Patient
exports.getDoctorClinic = catchAsyncErrors(async (req, res, next) => {
  const doctor = await Doctor.findById(req.query.id);

  if (!doctor) {
    return next(new ErrorHandler("Doctor not found", 404));
  }

  res.status(200).json({
    success: true,
    clinics: doctor.clinics,
  });
});

// Update Clinic details

exports.updateClinic = catchAsyncErrors(async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.doctor._id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const clinicToUpdate = doctor.clinics.find(
      clinic => clinic._id.toString() === req.params.id
    );
    if (!clinicToUpdate) {
      return res.status(404).json({ message: "Clinic not found" });
    }

    // Update clinic properties
    clinicToUpdate.clinicname = req.body.clinicname || clinicToUpdate.clinicname;
    clinicToUpdate.address = req.body.address || clinicToUpdate.address;
    clinicToUpdate.city = req.body.city || clinicToUpdate.city;
    clinicToUpdate.time = req.body.time || clinicToUpdate.time;
    clinicToUpdate.timeEnd = req.body.timeEnd || clinicToUpdate.timeEnd;
    clinicToUpdate.day = req.body.day || clinicToUpdate.day;

    await doctor.save();

    return res.status(200).json({
      message: "Clinic updated successfully",
      updatedClinic: clinicToUpdate,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error updating clinic", error });
  }
});







//Detle by Doctor Self
exports.deleteClinic = catchAsyncErrors(async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.doctor._id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const clinicToDelete = doctor.clinics.find(
      clinic => clinic._id.toString() === req.params.id
    );
    if (!clinicToDelete) {
      return res.status(404).json({ message: "Clinic not found try again" });
    }

    // Remove the clinic from the array using the filter method
    doctor.clinics = doctor.clinics.filter(
      clinic => clinic._id.toString() !== req.params.id
    );

    await doctor.save();

    return res.status(200).json({
      message: "Clinic deleted successfully",
      deletedClinic: clinicToDelete,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting clinic", error });
  }
});






// Delete Doctor Clinic 
//This one Working
// exports.deleteClinic =catchAsyncErrors (async (req, res, next) => {
//   try {
//     const doctor = await Doctor.findById(req.query.DoctorId);
  
//     if (!doctor) {
//       return res.status(404).json({ message: "Doctor not found" });
//     }
  
//     const clinicToDelete = doctor.clinics.find(
//       clinic => clinic._id.toString() === req.query.id.toString()
//     );
  
//     if (!clinicToDelete) {
//       return res.status(404).json({ message: "Clinic not found" });
//     }
  
//     // Remove the clinic from the array using the filter method
//     const clinic = doctor.clinics.filter(
//           (rev) => rev._id.toString() !== req.query.id.toString()
//         );

//         doctor.clinics = clinic
  
//         await doctor.save({new : true ,validateBeforeSave: false})
  
  
//     return res.status(200).json({ message: "Clinic deleted successfully", deletedClinic: clinicToDelete });
//   } catch (error) {
//     return res.status(500).json({ message: "Error deleting clinic", error: error });
//   }
  
// });




// Create New Review or Update the review uncomment is after setting Authentication 
exports.createDoctorReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment,} = req.body;

  const review = {
    user: req.admin._id,
    name: req.admin.name,
    rating: Number(rating),
    comment,
  };

  const doctor = await Doctor.findById(req.params.id);

  const isReviewed = doctor.reviews.find(
(rev) => rev.user.toString() === req.admin._id.toString()
  );

  if (isReviewed) {
    doctor.reviews.forEach((rev) => {
      if (rev.user.toString() === req.admin._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    doctor.reviews.push(review);
    doctor.numOfReviews = doctor.reviews.length;
  }

  let avg = 0;

  doctor.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  doctor.ratings = avg / doctor.reviews.length;

  await doctor.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});



exports.getMyReviews = catchAsyncErrors(async (req, res, next) => {
  const doctor = await Doctor.findById(req.params.id); 
  
      
    if (!doctor) {
      return next(new ErrorHandler("Doctor not found", 404));
    }
    const isReviewed = doctor.reviews.find(
      (rev) => rev.user.toString() === req.admin._id.toString()
        );
      
  
    res.status(200).json([{
    
      // reviews: doctor.reviews.isReviewed,
      reviews: isReviewed
}]);
  });
  
//Doctor Wil see All reviews
exports.getMyReviewsDoctor = catchAsyncErrors(async (req, res, next) => {
  // const doctor = await Doctor.findById(req.doctor._id); 
  const doctor = await Doctor.findById({_id:req.doctor._id});

      
      
  
  res.status(200).json(

    doctor.reviews,
 
   // success: true,
 );
  });





// Get All Reviews of a Doctor
exports.getDoctorReviews = catchAsyncErrors(async (req, res, next) => {
  const doctor = await Doctor.findById(req.query.id);

  if (!doctor) {
    return next(new ErrorHandler("Doctor not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: doctor.reviews,
  });
});


//Delete Doctor Review By Staff
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const doctor = await Doctor.findById(req.query.doctorId);

  if (!doctor) {
    return next(new ErrorHandler("Doctor not found", 404));
  }

  const reviews = doctor.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Doctor.findByIdAndUpdate(
    req.query.DoctorId,  //same way as getting doctor review
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});



// Delete Review By Doctor Self
exports.deleteReviewDoctor = catchAsyncErrors(async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.doctor._id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const reviewToDelete = doctor.reviews.find(
      (review) => review._id.toString() === req.params.id
    );
    if (!reviewToDelete) {
      return res.status(404).json({ message: "Review not found, try again" });
    }

    // Remove the review from the array using the filter method
    doctor.reviews = doctor.reviews.filter(
      (review) => review._id.toString() !== req.params.id
    );

    await doctor.save();

    return res.status(200).json({
      message: "Review deleted successfully",
      deletedReview: reviewToDelete,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting review", error });
  }
});
