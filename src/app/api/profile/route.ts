import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/user";

type UserDoc = {
  email: string;
  answers?: Record<string, string>;
  suggestion?: string;
  interests?: string[];
};

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json(
        { message: "Email is required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const result = await User.findOne({ email }).lean();

    if (Array.isArray(result) || !result) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    const user = result as unknown as UserDoc;

    return NextResponse.json({
      email: user.email,
      answers: user.answers || {},
      suggestion: user.suggestion || "No suggestion available.",
      interests: user.interests || [],
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
