import mongoose from "mongoose";

const opportunitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    company: {
      type: String,
      required: true,
    },

    type: {
      type: String, // internship, job, hackathon, scholarship
      required: true,
    },

    match: {
      type: Number,
      default: 0,
    },

    deadline: {
      type: String,
    },

    description: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Opportunity", opportunitySchema);