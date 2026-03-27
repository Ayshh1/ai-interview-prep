import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: Request) {
  try {
    const { code, problemTitle, language } = await req.json();

    if (!code || !problemTitle) {
      return NextResponse.json({ error: 'Missing code or problem title' }, { status: 400 });
    }

    const prompt = `
      Act as a senior technical interviewer. Review this ${language} code for: "${problemTitle}".
      User Code: ${code}

      Return a JSON object with:
      {
        "status": "success" | "error",
        "score": number,
        "output": "summary string",
        "feedback": {
          "syntax": "string",
          "logic": "string",
          "complexity": "string"
        }
      }
    `;

    // The exact syntax you requested:
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Note: 1.5 or 2.0-flash are current production models
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: 'application/json', // Forces valid JSON output
      }
    });

    const text = result.text || '{}'; 
    const reviewData = JSON.parse(text);

    return NextResponse.json(reviewData);

  } catch (error) {
    console.error('Gemini Review Error:', error);
    return NextResponse.json({ 
      status: "error", 
      output: "AI Review failed to process." 
    }, { status: 500 });
  }
}