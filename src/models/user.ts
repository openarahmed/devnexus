// models/user.ts
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      select: false, // Password won't be returned by default in queries
    },
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
    },
    profilePictureUrl: {
      type: String,
      trim: true,
      default: "", // Defaults to an empty string if not provided
    },
    isQuestionnaireCompleted: {
      type: Boolean,
      default: false,
    },
    answers: {
      type: mongoose.Schema.Types.Mixed, // Or a more specific schema
      default: {},
    },
    interests: {
      type: [String],
      default: [],
    },
    suggestion: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// Avoid recompiling the model if it already exists (common in Next.js dev mode)
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
