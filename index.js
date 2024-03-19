//INDEX FILE
const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");
const cloudinary = require("cloudinary");
const cors = require("cors");
const express = require('express')
const bodyParser = require('body-parser')


//const list_end_points = require("list_end_points");


dotenv.config({
  path: "./config/config.env",
});
app.use(cors());
// console.log('S3 BUCKET', process.env.AWS_BUCKET)

//list_end_points(app);


connectDatabase();







app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
