import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "../../../models/user";

export async function POST(request: Request) {
  const { email, answers, interests } = await request.json();

  if (!email || !answers) {
    return NextResponse.json(
      { message: "Email and answers are required." },
      { status: 400 }
    );
  }

  await connectToDatabase();

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    user.answers = answers;

    // ✅ Fix: match field name in schema exactly
    if (Array.isArray(interests)) {
      user.interests = interests;
    }

    // Suggestion logic
    let suggestion = "Default suggestion";
    switch (answers.q1) {
      case "Backend":
        suggestion =
          "Backend development with Node.js and Express is a great fit for you.";
        break;
      case "Frontend":
        suggestion = "Frontend development with React is recommended.";
        break;
      case "Fullstack":
        suggestion =
          "Fullstack development using the MERN stack is a great path for you.";
        break;
      case "DevOps":
        suggestion =
          "You might enjoy working on CI/CD pipelines and cloud infrastructure.";
        break;
      case "AI/ML":
        suggestion =
          "AI/ML development using Python and frameworks like TensorFlow or PyTorch would suit you.";
        break;
      case "Mobile":
        suggestion =
          "You could explore mobile development with Flutter or React Native.";
        break;
    }

    user.suggestion = suggestion;

    await user.save();

    return NextResponse.json({ suggestion });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
