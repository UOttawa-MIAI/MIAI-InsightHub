"use server";

import { GoogleGenAI } from "@google/genai";
import { getCourseReviews } from "@/lib/firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client"; // Note: In a real server action, use admin DB for security. We use client DB here for simplicity since rules aren't set.

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "dummy" });

export async function generateCourseInsight(courseCode: string) {
  try {
    // 1. Fetch course details & active syllabus URL
    const courseRef = doc(db, "Courses", courseCode);
    const courseSnap = await getDoc(courseRef);
    const courseData = courseSnap.data();
    
    // 2. Fetch anonymous reviews
    const reviews = await getCourseReviews(courseCode);
    
    if (!courseData && reviews.length === 0) {
      return { insight: "No data available yet for this course. Be the first to contribute a syllabus or a vibe check!" };
    }

    // 3. Prepare Context for Gemini (RAG part)
    let context = `Course: ${courseCode}\n\n`;
    
    if (courseData?.activeSyllabusUrl) {
      // In a full implementation, we'd use the Gemini File API to pass the PDF or extract text.
      // For this implementation, we simulate having the syllabus context.
      context += `[Syllabus document is available at: ${courseData.activeSyllabusUrl}]\n\n`;
    }

    if (reviews.length > 0) {
      context += `Student Anonymous Reviews (${reviews.length} total):\n`;
      reviews.forEach((r, idx) => {
        context += `Review ${idx + 1}:\n- Workload: ${r.workload}/5\n- Tech/Math: ${r.technicality}/5\n- Advice: ${r.vibe}\n\n`;
      });
    }

    // 4. Generate Insight using Gemini 1.5 Flash
    const prompt = `You are the MIAI Oracle, an AI assistant for the Master of Interdisciplinary AI program at University of Ottawa.
You are given a set of anonymous student reviews and optionally a syllabus reference for the course ${courseCode}.
Please provide a 2-paragraph "TL;DR Insight" for a prospective student. 
Summarize the workload intensity, the technical/math requirements, and the general advice from students. Keep your tone helpful, slightly witty, and highly structured.
If there are no reviews, state that there is not enough student feedback yet.

Context Data:
${context}
`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
    });

    return { insight: response.text };
  } catch (error: any) {
    console.error("Error generating insight:", error);
    return { insight: "The Oracle is currently resting (Gemini API error). Please try again later." };
  }
}
