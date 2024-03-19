const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
// const Admin = require("../models/admin");
// const sendToken = require("../utils/jwToken");
const Appointments = require("../models/Appointments");
const { uploader1 } = require("../ImageUpload");

//const sendEmail = require("../utils/sendEmail");
//const crypto = require("crypto");
//const cloudinary = require("cloudinary");


exports.newbooking = catchAsyncErrors(async (req, res, next) => {

    const { time, day, prescription, reports, doctor ,address,city,clinicname } = req.body;

    const appoinment = await Appointments.create({
        doctor,
        day,
        time,
        clinicname,
        address,
        city,
        prescription,
          reports,
      
        user: req.admin._id,
        patient: req.admin.name,
        mobile: req.admin.mobile,
      
    });
    res.status(201).json({
        success: true,
        appoinment,
      });
    });



    // Get Single Order Details by Doctor 
exports.getSingleBooking = catchAsyncErrors(async (req, res, next) => {
    const appoinment = await Appointments.findById(req.params.id).populate(
      "doctor", //which is listed in appointment model same we can use for user who booked
      "name email address"
    );
  
    if (!appoinment) {
      return next(new ErrorHandler("Appointment not found with this Id", 404));
    }
  
    
res.status(200).json({
    success: true,
    res : appoinment,
  });
}) ; 

// Get Loged in user Appointments detail
// get logged in user  Orders
exports.myorders = catchAsyncErrors(async (req, res, next) => {
    const appoinment = await Appointments.find({ user: req.admin._id })
    .populate(
      "doctor",
      "name address"
    );
  
    res.status(200).json(
     // success: true,
      appoinment,
    );
  });


  // Patient Booking History doctor will see


  exports.BookingHistory = catchAsyncErrors(async (req, res, next) => {
    const appoinment = await Appointments.find({ user: req.params.id })
    .populate(
      "doctor",
      "name address"
    );
  
    res.status(200).json(
     // success: true,
      appoinment,
    );
  });





 

//  Doctor will see Booking
  exports.mybookings = catchAsyncErrors(async (req, res, next) => {
    const appoinment = await Appointments.find({ doctor: req.doctor._id })
    .populate(
      "user",
      "address"
    );
  
    res.status(200).json(
     // success: true,
      appoinment,
    );
  });

  // update Booking Status -- Doctor
// exports.updatemybooking = catchAsyncErrors(async (req, res, next) => {
//   //const appoinment = await Appointments.findById({doctor:req.doctor._id});
//   const appoinment = await Appointments.findById(req.params.id)

//   if (!appoinment) {
//     return next(new ErrorHandler("Appointment not found with this Id", 404));
//   }

//   if (appoinment.status === "Done") {
//     return next(new ErrorHandler("You have already Done with this booking", 400));
//   }
//   // to cancel check
//   if (appoinment.status === "Cancel") {
//     return next(new ErrorHandler("Booking already Cancelled with this booking", 400));
//   }
//   if (req.body.status === "Cancel") {
//     appoinment.status = req.body.status // to Update statutus field we can aslo use presciption
//   }

//   if (appoinment.status === "Done") {
//     return next(new ErrorHandler("You have already Done with this booking", 400));
//   }

//   if (req.body.status === "Accepted") {
//     appoinment.status = req.body.status // to Update statutus field we can aslo use presciption
//   }

//   if (req.body.status === "Cancel") {
//     appoinment.status = req.body.status // to Update statutus field we can aslo use presciption
//   }
//   await appoinment.save({ validateBeforeSave: false });
//   res.status(200).json({
//     success: true,
//     res:appoinment,
//   });
// });


// this FOR Image Reports remove1



exports.UpdateReportRecords = catchAsyncErrors(async (req, res, next) => {
  const uploadSingle = uploader1().single("file");
  uploadSingle(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file was uploaded." });
    }

    const reportimg = req.file.location;
    const newReportData = {
      reportimg: reportimg,
      reportname: req.body.reportname,
    };

    try {
      const appointment = await Appointments.findById(req.params.id);
      appointment.reports.push(newReportData);

      await appointment.save({ validateBeforeSave: false });
      res.status(200).json({
        success: true,
        res: appointment,
      });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
});


// Update or Write Presciption
exports.updatemybooking = catchAsyncErrors(async (req, res, next) => {
  //const appoinment = await Appointments.findById({doctor:req.doctor._id});
  const newAppointmentData = {
    status: req.body.status,
    prescription: req.body.prescription,
  };

  const appoinment = await Appointments.findByIdAndUpdate(req.params.id,newAppointmentData,{
    new: true,
    runValidator: true,
    useFindAndModify: false,
  });

  
  await appoinment.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    res:appoinment,
  });
});

