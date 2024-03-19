const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("./catchAsyncErrors");

const jwt = require("jsonwebtoken");
//const Admin = require("../models/admin");
const Doctor = require("../models/doctor")

exports.isAuthenticatedDoctor = catchAsyncErrors(async (req, res, next) => {
  // get token as bearer from the header
  const { token } = req.cookies;
  //const token = req.headers?.authorization?.split(" ")?.[1];
  console.log(token);

  if (!token) {
    return next(new ErrorHandler("Docotr Please Login to access this resource", 401));
  }
  const decodedData = jwt.decode(token, process.env.JWT_SECRET);

  // const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.doctor = await Doctor.findById(decodedData.id);

  next();
});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.doctor.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.doctor.role} is not allowed to access this resouce `,
          403
        )
      );
    }

    next();
  };
};
