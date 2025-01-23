import asyncHandler from "express-async-handler";
import { Profile } from "../models/profile.models.js";
import { User } from "../models/user.models.js";
import { isValidCityForState } from "../utils/statecity.validation.js";
import upload from "../middleware/upload.middleware.js";
import fs from "fs";
import path from "path";

const validateImage = (file) => {
  if (!file) return true;

  const allowedFileTypes = /jpeg|jpg|png/;
  const extname = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mimetype = allowedFileTypes.test(file.mimetype);

  return extname && mimetype;
};

export const updateProfileData = asyncHandler(async (req, res) => {
  const { dob, gender, state, city, hobbies } = req.body;
  const userId = req.user.id;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ status: 0, message: "User not found" });
  }

  if (state && city) {
    const validation = await isValidCityForState(state, city);
    if (!validation.isValid) {
      return res.status(400).json({
        status: 0,
        message: validation.message,
      });
    }
  }

  let profile = await Profile.findOne({ userId });

  if (!profile) {
    profile = new Profile({
      userId,
      fullname: user.fullname,
      email: user.email,
      dob,
      gender,
      state,
      city,
      hobbies,
    });
  } else {
    profile.fullname = user.fullname;
    profile.email = user.email;
    profile.dob = dob;
    profile.gender = gender;
    profile.state = state;
    profile.city = city;
    profile.hobbies = hobbies;
  }

  await profile.save();
  user.profile = profile._id;
  await user.save();

  res.status(200).json({
    status: 1,
    data: {
      message: "Profile updated successfully",
      fullname: user.fullname,
      email: user.email,
      dob: profile.dob,
      gender: profile.gender,
      state: profile.state,
      city: profile.city,
      hobbies: profile.hobbies,
      image: profile.image
        ? `${req.protocol}://${req.get("host")}/uploads/${path.basename(
            profile.image
          )}`
        : undefined,
    },
  });
});

export const getProfile = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const profile = await Profile.findOne({ userId });
  res.status(200).json({ status: 1, data: profile });
});

export const updateProfileImage = [
  upload.single("image"),
  asyncHandler(async (req, res) => {
    if (!req.file || !validateImage(req.file)) {
      return res.status(400).json({
        status: 0,
        message: "Please provide a valid image file (.jpeg, .jpg or .png)",
      });
    }

    const userId = req.user.id;
    let profile = await Profile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        status: 0,
        message: "Profile not found. Please create a profile first",
      });
    }

    if (profile.image) {
      try {
        fs.unlinkSync(profile.image);
      } catch (err) {
        console.error("Error deleting old image:", err);
      }
    }

    profile.image = req.file.path;
    await profile.save();

    const imageUrl = `${req.protocol}:${req.get(
      "host"
    )}/uploads/${path.basename(profile.image)}`;

    res.status(200).json({
      status: 1,
      data: {
        message: "Profile image updated successfully",
        image: imageUrl,
      },
    });
  }),
];

export const deleteProfileImage = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({
      status: 0,
      message: "User ID is required",
    });
  }

  const profile = await Profile.findOne({ userId });

  if (!profile) {
    return res.status(404).json({
      status: 0,
      message: "Profile not found",
    });
  }

  if (!profile.image) {
    return res.status(400).json({
      status: 0,
      message: "No image found to delete",
    });
  }

  try {
    fs.unlinkSync(profile.image);

    profile.image = undefined;
    await profile.save();

    return res.status(200).json({
      status: 1,
      message: "Profile image deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: "Error deleting image file",
    });
  }
});
