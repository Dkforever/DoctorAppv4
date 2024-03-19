const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const dotenv = require("dotenv");

dotenv.config({
    path: "./config/config.env",
  });
  aws.config.update({
    accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: process.env.S3_BUCKET_REGION,
  bucket: process.env.AWS_BUCKET
});

const s3 = new aws.S3({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: process.env.S3_BUCKET_REGION,
    bucket: process.env.AWS_BUCKET
  });


  console.log('S3  BUCKET', process.env.S3_BUCKET_REGION)

 console.log(process.env.S3_ACCESS_KEY);
 console.log(process.env.AWS_BUCKET);


exports.uploader1 = () =>
  multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
     
    //  acl: 'public-read',
    key: function (req, file, cb) {
      cb(null,"Profile/" + file.originalname);
    }
  })

  });
 
 