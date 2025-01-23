import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    rolename: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export const Role = mongoose.model("Role", roleSchema);
