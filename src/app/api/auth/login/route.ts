// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "../../../../models/user"; // Ensure this path is correct
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const { email: loginEmail, password: plainTextPassword } =
    await request.json();

  if (!loginEmail || !plainTextPassword) {
    return NextResponse.json(
      { message: "Email and password are required." },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();

    const user = await User.findOne({ email: loginEmail }).select(
      "+password email name isQuestionnaireCompleted profilePictureUrl" // <-- ADD profilePictureUrl HERE
    );

    console.log(
      "Fetched user object from DB for login (with profilePictureUrl attempt):",
      JSON.stringify(user, null, 2)
    );

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    if (!user.email) {
      console.error(
        "CRITICAL: User object fetched from DB is missing email. User object:",
        user
      );
      return NextResponse.json(
        { message: "Server error: Failed to retrieve complete user details." },
        { status: 500 }
      );
    }

    if (typeof user.password !== "string") {
      console.error("User password is not a string for email:", loginEmail);
      return NextResponse.json(
        { message: "Server error: User data configuration issue." },
        { status: 500 }
      );
    }

    const isPasswordValid = await bcrypt.compare(
      plainTextPassword,
      user.password
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const hasCompletedQuestionnaire = user.isQuestionnaireCompleted || false;

    const userDataForClient = {
      id: user._id.toString(),
      email: user.email,
      name: user.name || null,
      hasCompletedQuestionnaire: hasCompletedQuestionnaire,
      profilePictureUrl: user.profilePictureUrl || "", // <-- ADD THIS LINE
    };

    console.log(
      "[Login API] userDataForClient prepared (with profilePictureUrl):",
      JSON.stringify(userDataForClient, null, 2)
    );

    return NextResponse.json(
      {
        message: "Login successful.",
        user: userDataForClient,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[LOGIN_API_ERROR_DETAILS]", error);
    return NextResponse.json(
      {
        message: "Server error processing your request.",
        errorDetails: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
