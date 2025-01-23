import express from "express";
import {
  updateProfileData,
  getProfile,
  updateProfileImage,
  deleteProfileImage,
} from "../controller/profile.controller.js";
import { protect } from "../middleware/auth.middleware.js";
const profileRouter = express.Router();

profileRouter.put("/update", protect, updateProfileData);
profileRouter.get("/:userId", getProfile);
profileRouter.put("/image", protect, updateProfileImage);
profileRouter.delete("/image/:userId", deleteProfileImage);

export default profileRouter;
