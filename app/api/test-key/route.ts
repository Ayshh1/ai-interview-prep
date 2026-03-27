export async function GET() {
  return Response.json({
    hasKey: !!process.env.GEMINI_API_KEY,
    keyLength: process.env.GEMINI_API_KEY?.length || 0,
    keyStart: process.env.GEMINI_API_KEY?.substring(0, 10) + '...' || 'not found'
  });
}
