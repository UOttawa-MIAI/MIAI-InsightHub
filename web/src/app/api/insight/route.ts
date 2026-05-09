import { NextResponse } from "next/server";
import { generateCourseInsight } from "@/app/actions";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const courseCode = searchParams.get("course");

  if (!courseCode) {
    return NextResponse.json({ error: "Missing course code" }, { status: 400 });
  }

  try {
    const data = await generateCourseInsight(courseCode.toUpperCase());
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
