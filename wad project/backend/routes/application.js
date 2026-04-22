import express from "express";
import Application from "../models/Application.js";

const router = express.Router();

// ✅ APPLY / SAVE
router.post("/", async (req, res) => {
  try {
    const app = new Application(req.body);
    await app.save();
    res.json(app);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET USER APPLICATIONS
router.get("/:userId", async (req, res) => {
  try {
    const data = await Application.find({
      userId: req.params.userId,
    }).populate("opportunityId");

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;