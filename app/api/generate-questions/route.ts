import { GoogleGenAI } from '@google/genai';

// The new SDK automatically looks for GEMINI_API_KEY, but explicit is fine
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(request: Request) {
  try {
    const { role, stack } = await request.json();

    if (!role || !stack) {
      return Response.json({ error: 'Role and stack are required' }, { status: 400 });
    }

    const prompt = `You are a senior technical interviewer. Generate exactly 6 interview questions for a ${role} developer with expertise in ${stack}. 
    Mix: 2 conceptual, 2 practical, 1 behavioral, 1 system design.
    Return an array of objects with: id (number), question (string), type (string), difficulty (easy|medium|hard).`;

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: 'application/json', // Forces valid JSON output
      }
    });

    // In the new SDK, response text is accessed via result.text
    const text = result.text || '{}'; 
    const questions = JSON.parse(text);

    return Response.json({ questions });
  } catch (error) {
    console.error('API Error:', error);
    return Response.json({ error: 'Generation failed' }, { status: 500 });
  }
}