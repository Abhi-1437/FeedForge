// Auth controller placeholder
// Implementation intentionally omitted per user request
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ msg: "Name, email and password are required" });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ msg: "Email already in use" });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });

  const secret = process.env.JWT_SECRET
  if (!secret) {
    return res.status(500).json({ msg: 'JWT_SECRET is not configured' })
  }

  const token = jwt.sign({ id: user._id }, secret);

  res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Email and password are required" });
  }

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ msg: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ msg: "Wrong password" });

  const secret = process.env.JWT_SECRET
  if (!secret) {
    return res.status(500).json({ msg: 'JWT_SECRET is not configured' })
  }

  const token = jwt.sign({ id: user._id }, secret);
  res.json({ token, user: { id: user._id, email: user.email } });
};

export const me = async (req, res) => {
  const user = await User.findById(req.user?.id).select("-password");
  if (!user) return res.status(404).json({ msg: "User not found" });
  res.json(user);
};