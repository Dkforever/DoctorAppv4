const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Labtest = require("../models/Labtest")
const AddCart = require("../models/TestCart")
const Testbooked = require("../models/TestBooked")

const Admin = require("../models/admin");


const sendToken = require("../utils/jwToken");
const { uploader1 } = require("../ImageUpload");



exports.Addtestlist = catchAsyncErrors(async (req, res, next) => {
 
    const {Testname,Testprice,TestDetail,Discount} = req.body;

    const labtest = await Labtest.create({
        Testname,
        Testprice,
        TestDetail,
        Discount,    
       
      });
      res.status(201).json(
       labtest,
   
      )  
})  


// Avalale Test List
exports.Testlist = catchAsyncErrors(async (req, res, next) => {
  const labtest = await Labtest.find(); 

  if (!labtest || labtest.length === 0) {
    return next(
      new ErrorHandler(`No items found in the cart`, 404) // Adjust the error message and status code
    );
  }

  res.status(200).json(labtest);
});

// Update Test Profile List

// exports.updateTestDetails= catchAsyncErrors(async (req, res, next) => {
//   const newTestData = {
//     Testname: req.body.Testname,
//     Testprice: req.body.Testprice,
//     TestDetail: req.body.TestDetail,
//     Discount:req.body.Discount,
//   };

  
//   const labtest = await Labtest.findByIdAndUpdate(req.params.id, newTestData, {
//     new: true,
//     runValidators: true,
//     useFindAndModify: false,
//   });

//   res.status(200).json({
//     success: true,
//     res : labtest,
//   });
// });



exports.updateTestDetails = catchAsyncErrors(async (req, res, next) => {
  try {
    const newTestData = {
      Testname: req.body.Testname,
      Testprice: req.body.Testprice,
      TestDetail: req.body.TestDetail,
      Discount: req.body.Discount,
    };

    const labtest = await Labtest.findByIdAndUpdate(req.params.id, newTestData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    if (!labtest) {
      return res.status(404).json({ success: false, message: 'Labtest not found' });
    }

    res.status(200).json({ success: true, data: labtest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error updating labtest' });
  }
});








  

exports.Cartest = catchAsyncErrors(async (req, res, next) => {
  const { Testname, Testprice, TestDetail,TestId, user,Discount } = req.body;

  // Check if the item already exists in the cart
  const existingCartItem = await AddCart.findOne({
    Testname,
    user: req.admin._id,
  });

  if (existingCartItem) {
    // await existingCartItem.save();
    const itme = "already added"
     res.status(201).json(itme);

  } else {
    // If the item doesn't exist, create a new cart item
    const newCartItem = await AddCart.create({
      Testname,
      Testprice,
      Discount,
      TestDetail,
      TestId,
      user: req.admin._id,
      
      quantity: 1, // Initialize the quantity to 1
    });

    res.status(201).json(newCartItem);
  }
});



// My cart Items
exports.MyCart = catchAsyncErrors(async (req, res, next) => {
  const cart = await AddCart.find({ user: req.admin._id }); // Change 'admin' to 'user'

  if (!cart || cart.length === 0) {
    return next(
      new ErrorHandler(`No items found in the cart`, 404) // Adjust the error message and status code
    );
  }

  res.status(200).json(cart);
});




// Delete or Remove from Cart items based on id
exports.deleteCart = catchAsyncErrors(async (req, res, next) => {
  const cart = await AddCart.findById(req.params.id);

  if (!cart) {
    return next(
      new ErrorHandler(`item does not exist with Id: ${req.params.id}`, 400)
    );
  }

  
  await cart.remove();

  res.status(200).json({
    success: true,
    message: "Cart Deleted Successfully",
  });
});





// Booked Tests by patients

// exports.bookTests = catchAsyncErrors(async (req, res, next) => {

//   const uploadSingle = uploader1().single("file");
//   uploadSingle(req, res, async (err) => {
//     if (err) {
//       return res.status(400).json({ error: err.message });
//     }

//     if (!req.file) {
//       return res.status(400).json({ error: "No file was uploaded." });
//     }


//   const prescriptionpic = req.file.location;
  


//   try {
//     const { userId,Patientname,Address,mobilenumber,bookedTests, } = req.body; // Assuming you have a user ID and a list of test IDs in the request body

    
//     // Create a new booking entry with the user and the selected tests
//     const bookedTest = await Testbooked.create({
//       userId: req.admin._id,
//       Patientname,
//       Address,
//       mobilenumber,
//       bookedTests,
//       prescriptionpic,

//     });

//     res.status(201).json({ success: true, data: bookedTest });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Error booking tests' });
//   }
// })
// });




exports.bookTests = catchAsyncErrors(async (req, res, next) => {

  // Assume you still want to handle the file upload, so you can keep this part
  const uploadSingle = uploader1().single("file");
  uploadSingle(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    const prescriptionpic = req.file ? req.file.location : null; // Use the uploaded file location if it exists

    try {
      const { Patientname, Address, mobilenumber, bookedTests } = req.body; // Assuming you have a user ID and a list of test IDs in the request body

      // Create a new booking entry with the user and the selected tests
      const bookedTest = await Testbooked.create({
        userId: req.admin._id,
        Patientname,
        Address,
        mobilenumber,
        bookedTests,
        prescriptionpic, // Use the uploaded file location or null
      });

      res.status(201).json({ success: true, data: bookedTest });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error booking tests' });
    }
  });
});




 // Update Booking Status By Staff 
 exports.updateBooking = catchAsyncErrors(async (req, res, next) => {
  try {
    const newData = {
      status: req.body.status,
    };

    const bookedTest = await Testbooked.findByIdAndUpdate(req.params.id, newData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    if (!bookedTest) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.status(200).json({ success: true, data: bookedTest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error updating Booking Status' });
  }
});





// My Bookings
exports.MyBooking = catchAsyncErrors(async (req, res, next) => {
  const cart = await Testbooked.find({ userId: req.admin._id }); // Change 'admin' to 'user'

  if (!cart || cart.length === 0) {
    return next(
      new ErrorHandler(`No items found in the cart`, 404) // Adjust the error message and status code
    );
  }

  res.status(200).json(cart);
});



