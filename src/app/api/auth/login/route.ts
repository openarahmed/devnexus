// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "../../../../models/user"; // Ensure this path is correct
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const { email: loginEmail, password: plainTextPassword } =
    await request.json(); // Renamed email to loginEmail to avoid conflict if user object also has 'email'

  if (!loginEmail || !plainTextPassword) {
    return NextResponse.json(
      { message: "Email and password are required." },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();

    // --- MODIFIED QUERY ---
    const user = await User.findOne({ email: loginEmail }).select(
      "+password email name isQuestionnaireCompleted" // Explicitly select email, name, and isQuestionnaireCompleted
    );
    // --- END MODIFIED QUERY ---

    console.log(
      "Fetched user object from DB for login (after query update):",
      JSON.stringify(user, null, 2)
    );

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Now 'user.email' should be populated if the above query worked and email exists for the user
    if (!user.email) {
      console.error(
        "CRITICAL: User object fetched from DB is still missing email even after explicit select. User object:",
        user
      );
      return NextResponse.json(
        {
          message:
            "Server error: Failed to retrieve complete user details from database.",
        },
        { status: 500 }
      );
    }

    if (typeof user.password !== "string") {
      console.error(
        "User password is not a string or not selected for email:",
        loginEmail
      );
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

    // Ensure 'isQuestionnaireCompleted' is a field in your User schema
    const hasCompletedQuestionnaire = user.isQuestionnaireCompleted || false;

    const userDataForClient = {
      id: user._id.toString(),
      email: user.email, // This should now have a value
      name: user.name || null, // This relies on 'name' being in schema and selected
      hasCompletedQuestionnaire: hasCompletedQuestionnaire,
    };

    console.log(
      "[Login API] userDataForClient prepared (after query update):",
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
