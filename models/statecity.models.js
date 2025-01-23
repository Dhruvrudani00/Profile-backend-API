import mongoose from "mongoose";

const statecitySchema = new mongoose.Schema(
  {
    stateName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    cityName: {
      type: [String],
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Statecity = mongoose.model("Statecity", statecitySchema);
