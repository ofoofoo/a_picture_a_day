import AWS from "aws-sdk";
import multer from "multer";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import express from "express";
import auth from "./auth";
import ImageModel from "./models/Image";
import UserModel from "./models/User";
dotenv.config({});

const router = express.Router();
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // Not logged in.
    return res.send({});
  }
  res.send(req.user);
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|
router.get("/userinfo", (req, res) => {
  try {
    const userId = req.query.userId;
  } catch (error) { }
});

router.post("/upload", upload.single('file'), async (req, res) => {
  const file = req.file;
  const userId = req.user?._id;
  const user = await UserModel.findById(userId);
  if (!user) {
    return res.status(404).send("User not found.");
  }

  if (!file) {
    return res.status(400).send("No file uploaded.");
  }

  const filekey = `${uuidv4()}-${file.originalname}`;
  const params = {
    Bucket: process.env.S3_BUCKET_NAME as string,
    Key: filekey,
    Body: file.buffer,
  };

  try {
    const response = await s3.upload(params).promise();

    const imageMeta = new ImageModel({
      url: response.Location,
      filekey,
      uploadedBy: userId,
      uploadedAt: new Date(),
    });
    await imageMeta.save();

    user.uploaded = imageMeta._id
    await user.save();

    res.status(200).json({
      success: true,
      url: response.Location,
    });
  } catch (error) {
    console.error('Failed to upload image to S3:', error);
    res.status(500).json({
      success: false,
    });
  }
});

router.post("/vote");

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  const msg = `Api route not found: ${req.method} ${req.url}`;
  res.status(404).send({ msg });
});

export default router;
