import AWS from "aws-sdk";
import multer from "multer";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import express from "express";
import auth from "./auth";
import ImageModel from "./models/Image";
import UserModel from "./models/User";
import { startOfDay, endOfDay } from "date-fns";
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
router.get("/userinfo", async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).send("Not logged in.");
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).send("User not found.");
    }

    const uploadedImage = ImageModel.findById(user.uploaded);
    const votingForImage = ImageModel.findById(user.votingFor);
    res.status(200).json({
      success: true,
      _id: user._id,
      name: user.name,
      uploaded: uploadedImage,
      votingFor: votingForImage,
    });
  } catch (error) {
    console.error('Failed to retrieve user info:', error);
    res.status(500).json({
      success: false,
    });
  }
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

router.post("/add-vote", async (req, res) => {
  const userId = req.user?._id;
  const imageId = req.body.imageId;

  const user = await UserModel.findById(userId);
  if (!user) {
    return res.status(404).send("User not found.");
  }

  const image = await ImageModel.findById(imageId);
  if (!image) {
    return res.status(404).send("Image not found.");
  }

  if (user.votingFor !== null) {
    const oldVotedImage = await ImageModel.findById(user.votingFor);
    if (oldVotedImage) {
      oldVotedImage.votes -= 1;
      await oldVotedImage.save();
    }
  }
  image.votes += 1;
  await image.save();
  user.votingFor = imageId;
  await user.save();

  res.status(200).json({
    success: true,
  });
});

router.get("/get-images", async (req, res) => {
  try {
    const dateString = req.query.date as string;
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return res.status(400).send("Invalid date.");
    }

    const start = startOfDay(date);
    const end = endOfDay(date);

    const images = await ImageModel.find({
      uploadedAt: {
        $gte: start,
        $lt: end,
      },
    });

    const imagesWithSignedUrl = images.map((image) => {
      const params = {
        Bucket: process.env.S3_BUCKET_NAME as string,
        Key: image.filekey,
        Expires: 7200,
      };
      const signedUrl = s3.getSignedUrl("getObject", params);
      return {
        ...image.toObject(),
        signedUrl,
      };
    });

    res.status(200).json({
      success: true,
      imagesWithSignedUrl,
    });
  } catch (error) {
    console.error('Failed to retrieve images:', error);
    res.status(500).json({
      success: false,
    });
  }
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  const msg = `Api route not found: ${req.method} ${req.url}`;
  res.status(404).send({ msg });
});

export default router;
