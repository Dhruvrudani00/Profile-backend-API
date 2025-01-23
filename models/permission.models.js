import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema(
  {
    role_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
    },
    role_name: {
      type: String,
      required: true,
      unique: true,
    },
    can_read: {
      type: Boolean,
      default: false,
    },
    can_write: {
      type: Boolean,
      default: false,
    },
    can_delete: {
      type: Boolean,
      default: false,
    },
    can_update: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Permission = mongoose.model("Permission", permissionSchema);
