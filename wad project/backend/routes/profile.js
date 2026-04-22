import express from "express";
import User from "../models/User.js";

const router = express.Router();

// GET profile
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE profile
router.put("/:userId", async (req, res) => {
  try {
    const { branch, year, skills, interests, college, linkedin, github, bio } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.params.userId,
      { branch, year, skills, interests, college, linkedin, github, bio },
      { new: true }
    ).select("-password");
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
