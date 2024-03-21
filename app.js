const express = require("express");
const app = express();
// const adminfire = require('firebase-admin');
// const serviceAccount = require('./doctorapp-d8c9f-firebase-adminsdk-xv62w-31f19733a4.json');
//   const fileUpload = require("express-fileupload");

const cors = require("cors");
const errorMiddleware = require("./middleware/error");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));


 const vapp = require("./routers/maintrouter");



app.use(cors());

app.use(errorMiddleware);
app.use(express.urlencoded({
    extended: true
}))
app.use("/api/v1", vapp);


module.exports = app;