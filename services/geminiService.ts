
import { GoogleGenAI, Type } from "@google/genai";
import { Worksheet, Difficulty } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export async function generateWorksheetData(
  grade: string,
  topic: string,
  difficulty: Difficulty,
  numQuestions: number
): Promise<Worksheet> {
  // Using Pro for maximum quality in educational logic
  const model = "gemini-3-pro-preview";
  
  const prompt = `You are a world-class Mathematics educator specialized in the CBSE/NCERT curriculum for India.
  Generate a professional math worksheet for ${grade}.
  Topic: ${topic}
  Difficulty Level: ${difficulty}
  Number of Questions: Exactly ${numQuestions}
  
  Guidelines:
  - For Class 1: Use simple language, focus on visual concepts, and use small numbers (usually up to 20 or 50).
  - Difficulty: 
    - EASY: Basic recall and simple application.
    - MEDIUM: Conceptual understanding and multi-step problems.
    - HARD: Critical thinking, HOTS (Higher Order Thinking Skills), and Olympiad-style challenges.
  - Mix question types: Some MCQs (provide 4 clear options) and some Short Answers.
  - Provide a clear, child-friendly step-by-step solution for every question.
  
  Respond ONLY with a valid JSON object matching the requested schema.`;

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
                type: { type: Type.STRING, enum: ["MCQ", "Short Answer"] },
                options: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING },
                  description: "Required if type is MCQ, otherwise empty array"
                },
                answer: { type: Type.STRING },
                solution: { type: Type.STRING }
              },
              required: ["id", "question", "type", "answer", "solution"]
            }
          }
        },
        required: ["title", "grade", "topic", "difficulty", "questions"]
      }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("No content received from AI engine.");
  }

  try {
    const data = JSON.parse(text);
    return data as Worksheet;
  } catch (error) {
    console.error("AI Response Parsing Failed:", text);
    throw new Error("The AI generated an invalid format. Please try again.");
  }
}
