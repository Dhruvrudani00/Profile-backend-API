import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/user.models.js";
import { Role } from "../models/role.models.js";
import { jwtconfig } from "../config/jwtConfig.js";

const passwordValidation =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const emailValidation = /^\S+@\S+\.\S+$/;

export const register = asyncHandler(async (req, res) => {
  const { email, password, fullname, role } = req.body;

  if (!email || !password || !fullname || !role) {
    return res
      .status(400)
      .json({ status: 0, message: "All fields are required." });
  }

  if (!emailValidation.test(email)) {
    return res
      .status(400)
      .json({ status: 0, message: "Please fill a valid email address" });
  }

  if (!passwordValidation.test(password)) {
    return res.status(400).json({
      status: 0,
      message:
        "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character.",
    });
  }

  if (fullname.length < 4) {
    return res
      .status(400)
      .json({ status: 0, message: "Full name must be at least 4 characters" });
  }

  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    return res
      .status(400)
      .json({ status: 0, message: "User already registered." });
  }

  const existingRole = await Role.findOne({ rolename: role });
  if (!existingRole) {
    return res
      .status(400)
      .json({ status: 0, message: "This role is not available." });
  }

  if (role === "admin") {
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ status: 0, message: "Admin role already exists." });
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashedPassword,
    fullname,
    role,
  });

  const accessToken = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    jwtconfig.secret,
    {
      expiresIn: jwtconfig.expiresIn,
    }
  );

  console.log(`User created: ${user}`);

  if (user) {
    return res.status(201).json({
      status: 1,
      message: "User created successfully",
      data: {
        _id: user.id,
        email: user.email,
        fullname: user.fullname,
        role: user.role,
        accessToken,
      },
    });
  } else {
    return res
      .status(400)
      .json({ status: 0, message: "User data is not valid." });
  }
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ status: 0, message: "All fields are required." });
  }

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      jwtconfig.secret,
      {
        expiresIn: jwtconfig.expiresIn,
      }
    );
    res.status(200).json({
      status: 1,
      message: "successful",
      accessToken,
    });
  } else {
    res.status(401).json({
      status: 0,
      message:
        "Email or password is not valid. Please enter a valid email or password",
    });
  }
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}, "-password");

  if (users) {
    res.status(200).json({
      status: 1,
      message: "retrieved successfully",
      data: users,
    });
  } else {
    res.status(404).json({
      status: 0,
      message: "No users found",
    });
  }
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id, "-password");
  res.status(200).json({
    status: 1,
    data: user,
  });
});
