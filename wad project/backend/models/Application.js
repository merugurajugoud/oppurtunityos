import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    opportunityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Opportunity",
    },

    status: {
      type: String,
      default: "applied", // applied / saved
    },
  },
  { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);