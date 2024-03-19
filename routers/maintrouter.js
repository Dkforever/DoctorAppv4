const express = require("express");
const { registerAadmin, loginAdmin, adminLogout, patient, updateAdminProfile, deleteAdmin, PatientMyprofile, ViewPatientMyprofile, updateProfilePic, SearchPatient } = require("../controller/admincontroller");
const { newbooking, getSingleBooking, myorders, mybookings, updatemybooking, UpdateReportRecords, BookingHistory, } = require("../controller/apponitmentController");
const { registerDoctor, doctors, createClinic, createDoctorReview, doctorLogout, loginDoctor, getDoctorReviews, getDoctorClinic, updateDoctorProfile, deleteReview, deleteClinic, myprofile, getMyClinic, updateClinic, getMyReviews, createImage, updateDoctorPic, DoctorSearch, DoctorSearch2, getMyReviewsDoctor, deleteReviewDoctor } = require("../controller/doctorController");
const { isAuthenticatedAdmin } = require("../middleware/auth");
const { isAuthenticatedDoctor } = require("../middleware/authDoctor");
const { Addtestlist, Cartest, deleteCart, MyCart, updateTestDetails, bookTests, MyBooking, updateBooking, Testlist } = require("../controller/Labtestcontroller");
// const { MyImage } = require("../myimage");
;
//const { isAuthenticatedAdmin } = require("../middleware/auth");

const router = express.Router();


// admin  User / Patient
router.route("/patients").get(patient);
router.route("/patient/SearchPatient").get(SearchPatient);
router.route("/patient/register").post(registerAadmin);
router.route("/patient/login").post(loginAdmin);
router.route("/patient/logout").post(adminLogout);
router.route("/patient/patientmyprofile").get(isAuthenticatedAdmin, PatientMyprofile);

router.route("/patient/updateprofile/:id").put(updateAdminProfile).delete(deleteAdmin);
// router.route("/patient/deleteProfile/:id").delete(deleteAdmin);


router.route("/patient/addreview/:id").put(isAuthenticatedAdmin, createDoctorReview);



// Doctor
router.route("/doctor/register").post(registerDoctor);
router.route("/doctor/login").post(loginDoctor);
router.route("/doctor/logout").post(doctorLogout);
router.route("/doctor/myprofile").get(isAuthenticatedDoctor, myprofile);
router.route("/doctor/updateprofile/:id").put(updateDoctorProfile);
router.route("/doctor/updateprofilepic").put(isAuthenticatedDoctor, updateDoctorPic);

router.route("/doctor").get(doctors);

router.route("/doctor/addclinic").post(isAuthenticatedDoctor, createClinic);
// router.route("/doctor/addclinic").post(createClinic);
router.route("/doctor/mybookings").get(isAuthenticatedDoctor, mybookings);

router.route("/doctor/updatemybookings/:id").put(isAuthenticatedDoctor, updatemybooking);



// Appointment 
router.route("/appointment/new").post(isAuthenticatedAdmin, newbooking);
router.route("/appointment/booking/:id").get(isAuthenticatedAdmin, getSingleBooking);
router.route("/appointment/myorders").get(isAuthenticatedAdmin, myorders);


router.route("/appointment/viewpatient/:id").get(ViewPatientMyprofile);



// Review Router
router.route("/doctor/myallreview").get(isAuthenticatedDoctor, getDoctorReviews);
router.route("/doctor/deleteReview").delete(isAuthenticatedDoctor, deleteReview);

router.route("/doctor/getmyreview/:id").get(isAuthenticatedAdmin, getMyReviews);
router.route("/doctor/getmyreviewDoctor").get(isAuthenticatedDoctor, getMyReviewsDoctor);
router.route("/doctor/deletereviewDoctor/:id").delete(isAuthenticatedDoctor, deleteReviewDoctor);


// get Doctor Clinic

router.route("/doctor/Myclinics").get(isAuthenticatedDoctor, getMyClinic);
router.route("/doctor/clinics").get(isAuthenticatedDoctor, getDoctorClinic);
// router.route("/doctor/deleteClinics").delete(isAuthenticatedDoctor ,deleteClinic);
router.route("/doctor/deleteClinics/:id").delete(isAuthenticatedDoctor, deleteClinic);
router.route("/doctor/updateteClinic/:id").put(isAuthenticatedDoctor, updateClinic);


// create image
router.route("/patient/Patientprofilepic").put(isAuthenticatedAdmin, updateProfilePic);
router.route("/patient/updateRecords/:id").put(UpdateReportRecords);
router.route("/patient/history/:id").get(BookingHistory);


//search Doctor by Thei details
router.route("/patient/DoctorSearch/:key").get(DoctorSearch);
router.route("/patient/DoctorSearch2").get(DoctorSearch2);




// Test Routers
router.route("/Labtest/Addtestlist").post(Addtestlist);
router.route("/Labtest/Testlist").get(Testlist);
router.route("/Labtest/UpdateTestdetails/:id").put(isAuthenticatedAdmin,updateTestDetails);
router.route("/Labtest/addcart").post(isAuthenticatedAdmin,Cartest);
router.route("/Labtest/Mycart").get(isAuthenticatedAdmin,MyCart);
router.route("/Labtest/deleteCart/:id").delete(isAuthenticatedAdmin,deleteCart);

router.route("/Labtest/booktest").post(isAuthenticatedAdmin,bookTests);
// router.route("/Labtest/booktest").post(isAuthenticatedAdmin,bookTests);
router.route("/Labtest/MyBooking").get(isAuthenticatedAdmin,MyBooking);
router.route("/Labtest/updateBooking/:id").put(isAuthenticatedAdmin,updateBooking);

module.exports = router;
