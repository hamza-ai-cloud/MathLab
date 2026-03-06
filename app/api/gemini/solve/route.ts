import { NextRequest, NextResponse } from 'next/server';
import { GeminiService } from '@/services/ai/gemini.service';
import { verifyAuth } from '@/middleware/auth';

export async function POST(request: NextRequest) {
  try {
    // Verify user authentication
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { problem } = await request.json();

    if (!problem) {
      return NextResponse.json(
        { error: 'Problem is required' },
        { status: 400 }
      );
    }

    // Call Gemini service for solving
    const solution = await GeminiService.solveMathProblem(problem);

    return NextResponse.json({
      success: true,
      data: solution,
    });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Gemini API error:', errMsg);

    if (errMsg.includes('GOOGLE_API_KEY')) {
      return NextResponse.json({ error: errMsg }, { status: 503 });
    }

    return NextResponse.json(
      { error: 'Failed to solve problem. ' + errMsg },
      { status: 500 }
    );
  }
}
