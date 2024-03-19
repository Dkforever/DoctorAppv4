const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const dotenv = require("dotenv");

dotenv.config({
    path: "../.././config/config.env",
   }
);
aws.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
});

const s3 = new aws.S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: process.env.S3_BUCKET_REGION,
  bucket: process.env.AWS_BUCKET
});


//   console.log('S3  BUCKET', process.env.S3_BUCKET_REGION)

// console.log(process.env.S3_ACCESS_KEY);
// console.log(process.env.AWS_BUCKET);


const upload = () =>
  multer({
    storage: multerS3({
      s3,
      bucket: process.env.AWS_BUCKET,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      acl: "public-read",
      key: function (req, file, cb) {
        cb(null, file.originalname);
      }
    })
  });
 
//   console.log('S3 BUCKET', process.env.S3_BUCKET_REGION)

// console.log(process.env.S3_ACCESS_KEY);
// console.log(process.env.AWS_BUCKET);

exports.setProfile = (req, res, next) => {
  console.log(req.file);
  const uploadSingle = upload().single("myPic");

  uploadSingle(req, res, (err) => {
    if (!req.files) res.status(400).json({ error: 'No files were uploaded.' });
    console.log(req.files);

    res.status(200).json({ data: req.files });
  });
};
