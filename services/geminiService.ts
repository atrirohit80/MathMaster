
import { GoogleGenAI, Type } from "@google/genai";
import { Worksheet, Difficulty } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export async function generateWorksheetData(
  grade: string,
  subject: string,
  topic: string,
  difficulty: Difficulty,
  numQuestions: number
): Promise<Worksheet> {
  const model = "gemini-3-pro-preview";
  
  const prompt = `You are an expert educator for the CBSE/NCERT curriculum in India.
  Generate a professional, high-quality worksheet.
  Grade: ${grade}
  Subject: ${subject}
  Topic: ${topic}
  Difficulty: ${difficulty}
  Number of Questions: Exactly ${numQuestions}
  
  Specific Subject Guidelines:
  - Science/EVS: Focus on conceptual understanding, definitions, and simple observations.
  - Mathematics: Focus on step-by-step problem solving.
  - English/Hindi: Focus on grammar, vocabulary, and reading comprehension.
  - Social Science: Focus on historical facts, geography concepts, and civic roles.
  
  Mixed Format:
  - Use a mix of Multiple Choice Questions (MCQ) and Short Answer questions.
  - For MCQs, provide 4 distinct, clear options.
  - Provide detailed "Master's Solutions" for every question that explain the reasoning.
  
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
          subject: { type: Type.STRING },
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
                  description: "Required for MCQ"
                },
                answer: { type: Type.STRING },
                solution: { type: Type.STRING }
              },
              required: ["id", "question", "type", "answer", "solution"]
            }
          }
        },
        required: ["title", "grade", "subject", "topic", "difficulty", "questions"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI.");

  try {
    return JSON.parse(text) as Worksheet;
  } catch (error) {
    throw new Error("Formatting error. Please regenerate.");
  }
}
