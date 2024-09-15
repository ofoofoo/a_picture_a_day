import AWS from "aws-sdk";
import multer from "multer";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import express from "express";
import auth from "./auth";
import ImageModel from "./models/Image";
import UserModel from "./models/User";
import WinnerModel from "./models/Winner";
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
const prompts = [
  "Right place wrong time",
  "A different perspective",
  "Comfort in the mundane",
  "What strength looks like",
  "The end of something",
  "What freedom feels like",
  "The calm before the storm",
  "A suspicious sandwich",
  "Fancy Schmancy",
  "What home means to you",
  "The greenest plant",
  "Teddy",
  "The color of calm",
  "A reflection of you",
  "Skibidi",
  "What you can't touch",
  "Growth in unexpected places",
  "The weight of expectation",
  "A familiar face in an unfamiliar place",
  "The shadow of a moment",
  "A friendly mouse",
  "The sound of silence",
  "A story told in shadows",
  "The beginning of something new",
  "The feeling of safety",
  "What hope looks like",
  "The midnight train",
  "A very very very very close-up",
  "On the verge",
  "The passage of time",
  "The goat",
  "Frolicking",
  "An unexpected reflection",
  "If animals had jobs",
  "A space between two worlds",
  "Oversized",
  "The colors of emotion",
  "A moment of pure focus",
  "The space between moments",
  "A decision yet to be made",
  "Nature vs. nurture",
  "A glimpse of the unknown",
  "A dragonfruit",
  "Echoes of the past",
  "Something left behind",
  "Hitting the gym",
  "A moment of pure joy",
  "What remains unsaid",
  "A moment of pure stillness",
  "Hitting a brick wall",
  "Kung Fu Panda",
  "Two moves ahead",
  "A window to another world",
  "The first light of day",
  "Where dreams meet reality",
  "A space that feels infinite",
  "What resilience looks like",
  "The beauty of decay",
  "Barely hanging on",
  "Where the wild things are",
  "What remains",
  "Through the eyes of a child",
  "An object with a soul",
  "Too much caffeine",
  "Academic victim",
  "Sound in silence",
  "A forgotten corner",
  "Someone you hate",
  "Life of the party",
  "Something that belongs in a museum",
  "Time standing still",
  "The beauty in imperfection",
  "Defying gravity",
  "Movement in stillness",
  "The edge of light",
  "A pattern in chaos",
  "An unexpected burst of color",
  "The end of a long day",
  "The bomb",
  "A journey, not a destination",
  "The texture of time",
  "Pants",
  "Something that just shouldn't exist",
  "The intersection of old and new",
  "The calm after chaos",
  "An unexpected gesture",
  "An unexpected harmony",
  "An invisible boundary",
  "Nope",
  "Unseen energy",
  "A whisper of history",
  "Help me",
  "A place that no longer exists",
  "Is this just fantasy?",
  "Freestyle",
  "Free lunch tomorrow",
  "The space between words",
  "Captured between moments",
  "The last piece of the puzzle",
  "The calm of a busy place",
  "Nature reclaiming",
  "The color of emotion",
  "Something that should have been forgotten",
  "Made you look",
  "Contradiction",
  "Something broken, something whole",
  "The first thing you touch today",
  "A cheeseburger",
  "Dark chocolate",
  "The listener",
  "A breath of fresh air",
  "Something that doesn't belong",
  "The illusion of choice",
  "The fragility of life",
  "Going back to the roots",
  "Caught in transition",
  "A place of refuge",
  "The warmth of a memory",
  "A moment frozen in time",
  "The weight of light",
  "Where the city breathes",
  "A fleeting emotion",
  "An unfinished story",
  "A world within a world",
  "A life untold",
  "The world's worst invention",
  "A place you've never noticed before",
  "The weight of silence",
  "A secret hiding in the open",
  "Something short",
  "A place where you feel small",
  "The last thing you'd want to step on",
  "Everything is fine",
  "Lost and found",
  "Simplicity in complexity",
  "This is addiction",
  "The color of time",
  "A fleeting moment",
  "The weight of the world",
  "A memory you’ve never lived",
  "A small detail that changes everything",
  "Under where?",
  "Light and shadow",
  "A connection between strangers",
  "Hidden in plain sight",
];
let curPromptIdx = 0;
router.get("/prompt", (req, res) => {
  res.status(200).send({ prompt: prompts[curPromptIdx] });
});

router.get("/update-prompt", (req, res) => {
  curPromptIdx = (curPromptIdx + 1) % prompts.length;
  res.status(200).send({ prompt: prompts[curPromptIdx] });
});

router.get("/userinfo", async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).send("Not logged in.");
    }

    const user = await UserModel.findById(userId).populate({
      path: "uploaded",
      populate: { path: "uploadedBy" },
      options: { maxDepth: 1 },
    });
    if (!user) {
      return res.status(404).send("User not found.");
    }

    res.status(200).json({
      success: true,
      _id: user._id,
      name: user.name,
      uploaded: user.uploaded,
      votingFor: user.votingFor,
    });
  } catch (error) {
    console.error("Failed to retrieve user info:", error);
    res.status(500).json({
      success: false,
    });
  }
});

router.post("/upload", upload.single("file"), async (req, res) => {
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

    user.uploaded = imageMeta._id;
    await user.save();

    res.status(200).json({
      success: true,
      url: response.Location,
    });
  } catch (error) {
    console.error("Failed to upload image to S3:", error);
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

router.get("/get-image", async (req, res) => {
  try {
    const userId = req.user?._id;
    const dateString = req.query.date as string;
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return res.status(400).send("Invalid date.");
    }

    const start = startOfDay(date);
    const end = endOfDay(date);

    const images = await ImageModel.find({
      uploadedBy: userId,
      uploadedAt: {
        $gte: start,
        $lt: end,
      },
    });

    if (images.length === 0) {
      return res.status(404).send("No image found.");
    } else if (images.length > 1) {
      return res.status(500).send("More than one image found.");
    }

    const params = {
      Bucket: process.env.S3_BUCKET_NAME as string,
      Key: images[0].filekey,
      Expires: 7200,
    };
    const signedUrl = s3.getSignedUrl("getObject", params);

    res.status(200).json({
      success: true,
      image: {
        ...images[0].toObject(),
        signedUrl,
      },
    });
  } catch (error) {
    console.error("Failed to retrieve image:", error);
    res.status(500).json({
      success: false,
    });
  }
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
    console.error("Failed to retrieve images:", error);
    res.status(500).json({
      success: false,
    });
  }
});

router.get("/get-winner", async (req, res) => {
  try {
    const dateString = req.query.date as string;
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return res.status(400).send("Invalid date.");
    }

    const start = startOfDay(date);
    const winner = await WinnerModel.findOne({
      date: {
        $eq: start,
      },
    });

    if (!winner) {
      return res.status(404).send("No winner found.");
    }

    const image = await ImageModel.findById(winner.image);
    if (!image) {
      return res.status(404).send("Image not found.");
    }

    const params = {
      Bucket: process.env.S3_BUCKET_NAME as string,
      Key: image.filekey,
      Expires: 7200,
    };
    const signedUrl = s3.getSignedUrl("getObject", params);

    res.status(200).json({
      success: true,
      image: {
        ...image.toObject(),
        signedUrl,
      },
      prompt: winner.prompt,
    });
  } catch (error) {
    console.error("Failed to retrieve winner:", error);
    res.status(500).json({
      success: false,
    });
  }
});

router.post("/reset-users", async (req, res) => {
  try {
    await UserModel.updateMany({}, { uploaded: null, votingFor: null });
    res.status(200).send("Users reset.");
  } catch (error) {
    console.error("Failed to reset users:", error);
    res.status(500).send("Failed to reset users.");
  }
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  const msg = `Api route not found: ${req.method} ${req.url}`;
  res.status(404).send({ msg });
});

export default router;
