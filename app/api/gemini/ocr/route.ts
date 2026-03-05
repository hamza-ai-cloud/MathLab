import { NextRequest, NextResponse } from 'next/server';
import { GeminiService } from '@/services/ai/gemini.service';
import { verifyAuth } from '@/middleware/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const image = formData.get('image') as File;

    if (!image) {
      return NextResponse.json(
        { error: 'Image is required' },
        { status: 400 }
      );
    }

    // Call Gemini service for OCR
    const extractedText = await GeminiService.extractMathFromImage(image);

    return NextResponse.json({
      success: true,
      text: extractedText,
    });
  } catch (error) {
    console.error('OCR error:', error);
    return NextResponse.json(
      { error: 'Failed to extract text from image' },
      { status: 500 }
    );
  }
}
