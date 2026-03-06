import { NextRequest, NextResponse } from 'next/server';
import { GeminiService } from '@/services/ai/gemini.service';

export const maxDuration = 60; // Allow up to 60s for large files

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversationHistory, fileBase64, fileMimeType, fileUrl } = body;

    if (!message && !fileBase64) {
      return NextResponse.json(
        { error: 'Message or file is required' },
        { status: 400 }
      );
    }

    const response = await GeminiService.tutorChat(
      conversationHistory || [],
      message || '',
      fileBase64,
      fileMimeType,
      fileUrl,
    );

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Tutor API error:', errMsg);

    // Surface helpful message for missing API key
    if (errMsg.includes('GOOGLE_API_KEY')) {
      return NextResponse.json(
        { error: errMsg },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to get tutor response. ' + errMsg },
      { status: 500 }
    );
  }
}
