import { GoogleGenAI } from '@google/genai';

// The new SDK automatically looks for GEMINI_API_KEY, but explicit is fine
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(request: Request) {
  try {
    const { role, stack, languages, experience } = await request.json();

    if (!role || !stack || !experience) {
      return Response.json({ error: 'Role, stack, and experience are required' }, { status: 400 });
    }

    const experienceLevel = experience === 'entry' ? 'beginner' : experience === 'mid' ? 'intermediate' : 'advanced';
    
    const prompt = `You are a senior technical interviewer. Generate exactly 8 interview questions for a ${experienceLevel} ${role} developer with expertise in ${stack} and proficiency in ${languages}. 
    Questions should progress from basic to advanced:
    - 2 basic/fundamental questions (easy)
    - 3 intermediate questions (medium) 
    - 3 advanced questions (hard)
    
    Mix: 3 conceptual, 3 practical, 1 behavioral, 1 system design.
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