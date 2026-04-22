import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import oppRoutes from "./routes/opportunity.js";
import appRoutes from "./routes/application.js";
import profileRoutes from "./routes/profile.js";
import cors from "cors";
import axios from "axios";

dotenv.config(); // VERY IMPORTANT
//console.log("ENV:", process.env.MONGO_URI);

const app = express();
app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/opportunities", oppRoutes);
app.use("/api/applications", appRoutes);
app.use("/api/profile", profileRoutes);

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
})
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => {
    console.log("MongoDB Error ❌", err.message);
    process.exit(1);
  });

app.get("/", (req, res) => {
  res.send("Backend is working 🚀");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

app.post("/api/chat", async (req, res) => {
  const msg = req.body.message;

  try {
    const mlResponse = await axios.post("http://127.0.0.1:8000/api/ml/chat", {
      message: msg
    }, { timeout: 3000 });
    
    if (mlResponse.data && mlResponse.data.reply) {
      return res.json({ reply: mlResponse.data.reply });
    }
  } catch (error) {
    console.log("ML Chat service error, using fallback.");
  }

  // Fallback
  let reply = "Try searching opportunities 🔍";
  if (msg.includes("internship")) {
    reply = "Go to internships section 💼";
  } else if (msg.includes("hackathon")) {
    reply = "Check out the Hackathons tab! 🚀";
  }

  res.json({ reply });
});



