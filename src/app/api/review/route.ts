import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {

    try{
    const { topic, instructions, assignment } = await request.json();

    if (
        typeof topic !== "string" || !topic.trim() || typeof assignment !== "string" || !assignment.trim()
    ) {
        return NextResponse.json(
            { error: "Topic and assignment text are required." },
            { status: 400 }
        );
    }

     const result = await generateText({
      model: google("gemini-flash-lite-latest"),
      system: `You are AssignmentLens, an academic assignment reviewer.
      Evaluate the assignment fairly and constructively.
      Assess:
      1. Relevance to the topic
      2. Missing requirements based on the instructions
      3. Strengths
      4. Areas for improvement
      5. Specific recommendations.

      If no instructions are provided, do not invent requirements.
      Do not rewrite the entire assignment.
      Clearly explain that your feedback may not be perfect.`,
      prompt: `
        Assignment topic:
        ${topic}

        Teacher's instructions:
        ${instructions || "No instructions provided."}

        Assignment text:
        ${assignment}
      `,
    });

    return NextResponse.json({ feedback: result.text });
  } catch (error) {
    console.error("Assignment review failed:", error);

    return NextResponse.json(
      { error: "Failed to review the assignment. Please try again." },
      { status: 500 }
    );
  }

}