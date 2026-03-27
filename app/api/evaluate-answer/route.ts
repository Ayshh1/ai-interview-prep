import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(request: Request) {
  try {
    const { question, answer, role } = await request.json();

    if (!question || !answer || !role) {
      return Response.json({ error: 'Missing fields' }, { status: 400 });
    }

    const prompt = `Evaluate this interview answer for a ${role} position. 
    Question: ${question}
    Answer: ${answer}
    Return a JSON object with: score (1-10), confidence (low|medium|high), strengths (array), improvements (array), summary (string).`;

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: 'application/json',
      }
    });

    const feedback = JSON.parse(result.text || '{}');

    // Clean up score just in case
    feedback.score = Math.max(1, Math.min(10, Number(feedback.score)));

    return Response.json({ feedback });
  } catch (error) {
    console.error('Evaluation Error:', error);
    return Response.json({ error: 'Evaluation failed' }, { status: 500 });
  }
}