import { Role } from "../models/role.models.js";
import asyncHandler from "express-async-handler";
import { adminAuth } from "../middleware/adminAuth.middleware.js";

export const initializeRoles = asyncHandler(async (req, res) => {
  const roles = ["admin", "user"];
  for (const rolename of roles) {
    const existingRole = await Role.findOne({ rolename });
    if (!existingRole) {
      await Role.create({ rolename, user: "system" });
    }
  }
  console.log("Roles initialized successfully");
});

export const createRole = [
  adminAuth,
  asyncHandler(async (req, res) => {
    const { rolename, user } = req.body;

    const existingRole = await Role.findOne({ rolename });
    if (existingRole) {
      res.status(400).json({ status: 0, message: "Role already exists" });
    }

    const role = await Role.create({ rolename, user });
    res
      .status(201)
      .json({ status: 1, message: "Role created successfully", role });
  }),
];

export const getAllRoles = [
  adminAuth,
  asyncHandler(async (req, res) => {
    const roles = await Role.find();
    res.status(200).json(roles);
  }),
];

export const getRoleById = [
  adminAuth,
  asyncHandler(async (req, res) => {
    const role = await Role.findById(req.params.id);
    if (!role) {
      res.status(404).json({ status: 0, message: "Role not found" });
    }
    res.status(200).json(role);
  }),
];

export const updateRole = [
  adminAuth,
  asyncHandler(async (req, res) => {
    const { rolename, user } = req.body;
    const role = await Role.findByIdAndUpdate(
      req.params.id,
      { rolename, user },
      { new: true }
    );

    if (!role) {
      res.status(404).json({ status: 0, message: "Role not found" });
    }

    res
      .status(200)
      .json({ status: 1, message: "Role updated successfully", role });
  }),
];

export const deleteRole = [
  adminAuth,
  asyncHandler(async (req, res) => {
    const role = await Role.findByIdAndDelete(req.params.id);
    if (!role) {
      res.status(404).json({ status: 0, message: "Role not found" });
    }
    res.status(200).json({ status: 1, message: "Role deleted successfully" });
  }),
];
