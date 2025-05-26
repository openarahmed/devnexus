// models/user.ts (or wherever your schema is defined)
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
      select: false, // Good for security
    },
    name: {
      // Ensure this field is present
      type: String,
      required: [true, "Name is required."], // Make name required
      trim: true,
    },
    profilePictureUrl: {
      // New field for profile picture
      type: String,
      trim: true,
      default: "", // Optional: provide a default placeholder URL
    },
    isQuestionnaireCompleted: {
      type: Boolean,
      default: false,
    },
    answers: {
      type: mongoose.Schema.Types.Mixed,
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
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
