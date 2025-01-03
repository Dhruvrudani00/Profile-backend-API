import express from "express";
import {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
} from "../controller/role.controller.js";

const roleRouter = express.Router();

roleRouter.post("/", createRole);
roleRouter.get("/", getAllRoles);
// roleRouter.get("/:id", getRoleById);
roleRouter.put("/:id", updateRole);
roleRouter.delete("/:id", deleteRole);

export default roleRouter;
