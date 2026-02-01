
import { GoogleGenAI, Type } from "@google/genai";
import { Worksheet, Difficulty } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export async function generateWorksheetData(
  grade: string,
  topic: string,
  difficulty: Difficulty
): Promise<Worksheet> {
  const model = "gemini-3-pro-preview";
  
  const prompt = `Generate a high-quality Mathematics worksheet for CBSE ${grade}, Topic: ${topic}, Difficulty Level: ${difficulty}.
  Include exactly 5 diverse questions. 
  - For EASY: Similar to NCERT textbook examples.
  - For MEDIUM: Standard practice problems with moderate complexity.
  - For HARD: Higher Order Thinking Skills (HOTS) and Olympiad level questions.
  Provide detailed step-by-step solutions for each.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          grade: { type: Type.STRING },
          topic: { type: Type.STRING },
          difficulty: { type: Type.STRING },
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.INTEGER },
                question: { type: Type.STRING },
                type: { type: Type.STRING, description: "MCQ or Short Answer" },
                options: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING },
                  description: "Only for MCQ type"
                },
                answer: { type: Type.STRING, description: "The correct final answer" },
                solution: { type: Type.STRING, description: "Step by step explanation" }
              },
              required: ["id", "question", "type", "answer", "solution"]
            }
          }
        },
        required: ["title", "grade", "topic", "difficulty", "questions"]
      }
    }
  });

  try {
    const data = JSON.parse(response.text);
    return data as Worksheet;
  } catch (error) {
    console.error("Failed to parse worksheet JSON:", error);
    throw new Error("Failed to generate a valid worksheet structure.");
  }
}
