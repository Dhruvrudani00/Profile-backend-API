import { Role } from "../models/role.models.js";
import asyncHandler from "express-async-handler";
import { checkPermission } from "../middleware/checkPermission.middleware.js";
import { Permission } from "../models/permission.models.js";

export const initializeRoles = asyncHandler(async (req, res) => {
  const roles = ["admin", "manager", "user"];

  for (const rolename of roles) {
    try {
      const existingRole = await Role.findOne({ rolename });

      if (!existingRole) {
        const role = await Role.create({ rolename, user: "system" });

        if (rolename === "admin") {
          await Permission.create({
            role_id: role._id,
            role_name: rolename,
            can_read: true,
            can_write: true,
            can_delete: true,
            can_update: true,
          });
        } else if (rolename === "manager") {
          await Permission.create({
            role_id: role._id,
            role_name: rolename,
            can_read: true,
            can_write: true,
            can_delete: false,
            can_update: false,
          });
        } else if (rolename === "user") {
          await Permission.create({
            role_id: role._id,
            role_name: rolename,
            can_read: true,
            can_write: false,
            can_delete: false,
            can_update: false,
          });
        }
      }
    } catch (error) {
      console.error(`Error initializing role ${rolename}:`, error);
    }
  }

  console.log("Roles and permissions initialized successfully");
});

export const createRole = [
  checkPermission,

  asyncHandler(async (req, res) => {
    const { rolename, user } = req.body;

    const existingRole = await Role.findOne({ rolename });
    if (existingRole) {
      return res
        .status(400)
        .json({ status: 0, message: "Role already exists" });
    }

    const role = await Role.create({ rolename, user });
    await Permission.create({
      role_id: role._id,
      role_name: rolename,
      can_read: false,
      can_write: false,
      can_delete: false,
      can_update: false,
    });
    res
      .status(201)
      .json({ status: 1, message: "Role created successfully", role });
  }),
];

export const getAllRoles = [
  checkPermission,
  asyncHandler(async (req, res) => {
    const roles = await Role.find();
    res.status(200).json(roles);
  }),
];

export const getRoleById = [
  checkPermission,
  asyncHandler(async (req, res) => {
    const role = await Role.findById(req.params.id);
    if (!role) {
      res.status(404).json({ status: 0, message: "Role not found" });
    }
    res.status(200).json(role);
  }),
];

export const updateRole = [
  checkPermission,
  asyncHandler(async (req, res) => {
    const { rolename, user } = req.body;
    const role = await Role.findByIdAndUpdate(
      req.params.id,
      { rolename, user },
      { new: true }
    );

    if (!role) {
      return res.status(404).json({ status: 0, message: "Role not found" });
    }

    res
      .status(200)
      .json({ status: 1, message: "Role updated successfully", role });
  }),
];

export const deleteRole = [
  checkPermission,
  asyncHandler(async (req, res) => {
    const role = await Role.findByIdAndDelete(req.params.id);
    if (!role) {
      return res.status(404).json({ status: 0, message: "Role not found" });
    }

    await Permission.findOneAndDelete({ role_id: role._id });

    res.status(200).json({ status: 1, message: "Role deleted successfully" });
  }),
];
