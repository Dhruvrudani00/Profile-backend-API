import { Statecity } from "../models/statecity.models.js";
import asyncHandler from "express-async-handler";
import { checkPermission } from "../middleware/checkPermission.middleware.js";

export const createStatecity = [
  checkPermission,
  asyncHandler(async (req, res) => {
    const { stateName, cityName } = req.body;
    const existingState = await Statecity.findOne({ stateName });
    if (existingState) {
      res.status(400).json({ status: 0, message: "State already exists" });
    }
    const statecity = await Statecity.create({ stateName, cityName });
    res.status(201).json({
      status: 1,
      message: "Statecity created successfully",
      statecity,
    });
  }),
];

export const getStatecity = [
  checkPermission,
  asyncHandler(async (req, res) => {
    const statecity = await Statecity.find();

    if (!statecity) {
      res.status(404).json({ status: 0, message: "Statecity not found" });
    } else {
      res.status(200).json({
        status: 1,
        message: "Statecity fetched successfully",
        statecity,
      });
    }
  }),
];

export const getStatecityById = [
  checkPermission,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const statecity = await Statecity.findById(id);
    res.status(200).json({
      status: 1,
      message: "Statecity fetched successfully",
      statecity,
    });
  }),
];

export const updateStatecity = [
  checkPermission,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { stateName, cityName } = req.body;
    const statecity = await Statecity.findByIdAndUpdate(
      id,
      { stateName, cityName },
      { new: true }
    );
    res.status(200).json({
      status: 1,
      message: "Statecity updated successfully",
      statecity,
    });
  }),
];

export const deleteStatecity = [
  checkPermission,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await Statecity.findByIdAndDelete(id);
    res
      .status(200)
      .json({ status: 1, message: "Statecity deleted successfully" });
  }),
];
