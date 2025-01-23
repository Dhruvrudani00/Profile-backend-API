import { checkPermission } from "../middleware/checkPermission.middleware.js";
import { Permission } from "../models/permission.models.js";
import asyncHandler from "express-async-handler";

export const updatePermission = [
  checkPermission,
  asyncHandler(async (req, res) => {
    const { role_id } = req.params;
    const { can_read, can_write, can_update, can_delete } = req.body;

    const updatedPermission = await Permission.findOneAndUpdate(
      { role_id },
      {
        can_read,
        can_write,
        can_update,
        can_delete,
      },
      { new: true }
    );

    if (!updatedPermission) {
      return res.status(404).json({
        status: 0,
        message: "Permission not found for the given role ID.",
      });
    }

    res.status(200).json({
      status: 1,
      message: "Permissions updated successfully.",
    });
  }),
];

export const getPermissionById = [
  checkPermission,
  asyncHandler(async (req, res) => {
    const { role_id } = req.params;

    const permission = await Permission.findOne({ role_id });

    if (!permission) {
      return res.status(404).json({
        status: 0,
        message: "Permission not found for the given role ID.",
      });
    }

    res.status(200).json({
      status: 1,
      message: "Permission retrieved successfully.",
      data: permission,
    });
  }),
];
