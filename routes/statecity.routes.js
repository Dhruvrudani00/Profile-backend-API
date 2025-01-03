import express from "express";
import {
  createStatecity,
  deleteStatecity,
  getStatecity,
  getStatecityById,
  updateStatecity,
} from "../controller/statecity.controller.js";

const statecityRouter = express.Router();

statecityRouter.post("/", createStatecity);
statecityRouter.get("/", getStatecity);
statecityRouter.get("/:id", getStatecityById);
statecityRouter.put("/:id", updateStatecity);
statecityRouter.delete("/:id", deleteStatecity);

export default statecityRouter;
