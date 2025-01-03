import jwt from "jsonwebtoken";
import { jwtconfig } from "../config/jwtConfig.js";
import asyncHandler from "express-async-handler";

export const adminAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];

    try {
      const decoded = jwt.verify(token, jwtconfig.secret);

      if (decoded.role !== "admin") {
        return res.status(403).json({
          status: 0,
          message: "Access denied. Admin role required.",
        });
      }

      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({
        status: 0,
        message: "Not authorized, invalid token",
      });
    }
  }

  if (!token) {
    res.status(401).json({
      status: 0,
      message: "Not authorized, no token provided",
    });
  }
});
