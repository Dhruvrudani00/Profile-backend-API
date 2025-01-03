import express from "express";
import {
  updateProfileData,
  updateProfileImage,
  deleteProfileImage,
} from "../controller/profile.controller.js";
import { protect } from "../middleware/auth.middleware.js";
const profileRouter = express.Router();

profileRouter.put("/update", protect, updateProfileData);
profileRouter.put("/image", protect, updateProfileImage);
profileRouter.delete("/image/:userId", deleteProfileImage);

export default profileRouter;
