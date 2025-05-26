/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ message: "MongoDB connection successful" });
  } catch (error) {
    return NextResponse.json(
      { error: "MongoDB connection failed" },
      { status: 500 }
    );
  }
}
