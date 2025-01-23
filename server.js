import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/connect.js";
import router from "./routes/user.routes.js";
import profileRouter from "./routes/profile.routes.js";
import roleRouter from "./routes/role.routes.js";
import statecityRouter from "./routes/statecity.routes.js";
import { initializeRoles } from "./controller/role.controller.js";
import path from "path";
import { fileURLToPath } from "url";
import { permissionRouter } from "./routes/permission.routes.js";

dotenv.config();
connectDB();
initializeRoles();

const app = express();
app.use(express.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/api/role", roleRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/user/profile", profileRouter);
app.use("/api/statecity", statecityRouter);
app.use("/api/user", router);
app.use("/api/permission", permissionRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port:${port}`);
});
