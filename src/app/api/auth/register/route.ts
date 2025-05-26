/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb"; // Adjust path if needed
import User from "../../../../models/user"; // Adjust path if needed
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password, name, profilePictureUrl } = await request.json();

    // ---- LOG 1: See what data is received from the frontend ----
    console.log("[Register API] Received data from frontend:", {
      email,
      password: "[PASSWORD_REDACTED]", // Don't log plaintext password
      name,
      profilePictureUrl,
    });

    // Validations
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email, and password are required." },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }
    if (profilePictureUrl && typeof profilePictureUrl !== "string") {
      return NextResponse.json(
        { message: "Profile picture URL must be a string." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists with this email." },
        { status: 409 } // 409 Conflict
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUserDocument = {
      name,
      email,
      password: hashedPassword,
      profilePictureUrl: profilePictureUrl || "", // Use provided URL or default to empty string
      // Other fields (isQuestionnaireCompleted, answers, etc.) will take defaults from schema
    };

    // ---- LOG 2: See what data is about to be passed to the User constructor ----
    console.log(
      "[Register API] newUser object being prepared for save:",
      JSON.stringify(
        newUserDocument,
        (key, value) => (key === "password" ? "[PASSWORD_REDACTED]" : value),
        2
      )
    );

    const newUser = new User(newUserDocument);
    await newUser.save();

    // ---- LOG 3: See the saved user (Mongoose returns the saved doc, including defaults) ----
    // Exclude password from this log as well for security
    const savedUserObject = newUser.toObject(); // Convert to plain object to allow deletion
    if (savedUserObject.password) {
      delete savedUserObject.password;
    }
    console.log(
      "[Register API] User saved to DB (Mongoose document, password redacted):",
      JSON.stringify(savedUserObject, null, 2)
    );

    // Prepare data to return to the client (without password)
    const userToReturn = {
      id: newUser._id.toString(),
      email: newUser.email,
      name: newUser.name,
      profilePictureUrl: newUser.profilePictureUrl,
      hasCompletedQuestionnaire: newUser.isQuestionnaireCompleted,
    };

    return NextResponse.json(
      { message: "✅ User registered successfully.", user: userToReturn },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[REGISTER_API_ERROR]", error);
    let errorMessage = "Server error during registration.";
    let errorDetails = error.message;
    let statusCode = 500;

    if (error.name === "ValidationError") {
      errorMessage = "Validation Error";
      errorDetails = Object.values(error.errors)
        .map((val: any) => val.message)
        .join(", ");
      statusCode = 400;
    }

    return NextResponse.json(
      { message: errorMessage, errorDetails: errorDetails },
      { status: statusCode }
    );
  }
}
