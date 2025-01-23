import express from "express";
import { checkPermission } from "../middleware/checkPermission.middleware.js";
import { protect } from "../middleware/auth.middleware.js";
import {
  createStatecity,
  deleteStatecity,
  getStatecity,
  getStatecityById,
  updateStatecity,
} from "../controller/statecity.controller.js";

const statecityRouter = express.Router();

statecityRouter.use(protect);
statecityRouter.use(checkPermission);

statecityRouter.post("/", createStatecity);
statecityRouter.get("/", getStatecity);
statecityRouter.get("/:id", getStatecityById);
statecityRouter.put("/:id", updateStatecity);
statecityRouter.delete("/:id", deleteStatecity);

export default statecityRouter;
