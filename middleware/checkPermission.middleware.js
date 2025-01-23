import { Permission } from "../models/permission.models.js";

export const checkPermission = async (req, res, next) => {
  try {
    const userRole = req.user.role;
    const requestedEndpoint = req.originalUrl.split("?")[0];
    const requestedMethod = req.method;

    const permission = await Permission.findOne({ role_name: userRole });

    if (!permission) {
      return res.status(403).json({
        status: 0,
        message: "Permissions not found for this role",
      });
    }

    const hasPermission =
      (requestedMethod === "GET" && permission.can_read) ||
      (requestedMethod === "POST" && permission.can_write) ||
      (requestedMethod === "PUT" && permission.can_update) ||
      (requestedMethod === "DELETE" && permission.can_delete);

    if (!hasPermission) {
      return res.status(403).json({
        status: 0,
        message: "You don't have permission.",
      });
    }

    next();
  } catch (error) {
    console.error("Permission check error:", error);
    res.status(500).json({
      status: 0,
      message: "Internal server error",
    });
  }
};
