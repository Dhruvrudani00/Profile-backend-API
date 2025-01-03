import express from "express";
import { login, register, getAllUsers } from "../controller/user.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/users", getAllUsers);

export default router;
