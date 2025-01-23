import express from "express";
import { checkPermission } from "../middleware/checkPermission.middleware.js";
import { protect } from "../middleware/auth.middleware.js";
import {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
} from "../controller/role.controller.js";

const roleRouter = express.Router();

roleRouter.use(protect);
roleRouter.use(checkPermission);

roleRouter.post("/", createRole);
roleRouter.get("/", getAllRoles);
roleRouter.put("/:id", updateRole);
roleRouter.delete("/:id", deleteRole);

export default roleRouter;
