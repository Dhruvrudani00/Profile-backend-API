import express from "express";
import {
  getPermissionById,
  updatePermission,
} from "../controller/permission.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { checkPermission } from "../middleware/checkPermission.middleware.js";

export const permissionRouter = express.Router();
permissionRouter.use(protect);
permissionRouter.use(checkPermission);

permissionRouter.put("/:role_id", updatePermission);
permissionRouter.get("/:role_id", getPermissionById);
