import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // Profile fields for personalization
    branch: { type: String, default: "" },
    year: { type: String, default: "" },
    skills: { type: [String], default: [] },
    interests: { type: [String], default: [] },
    college: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    github: { type: String, default: "" },
    bio: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
