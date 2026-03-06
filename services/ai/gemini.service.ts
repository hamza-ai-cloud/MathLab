import { GoogleGenerativeAI, Content, GenerativeModel } from '@google/generative-ai';

export interface TutorMessage {
  role: 'user' | 'model';
  text?: string;
  fileData?: { mimeType: string; data: string };
}

export class GeminiService {
  private static _model: GenerativeModel | null = null;

  /** Lazy-init: read GOOGLE_API_KEY at call-time, not module-load time */
  private static getModel(): GenerativeModel {
    if (this._model) return this._model;

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey || apiKey === 'your_google_api_key') {
      throw new Error(
        'GOOGLE_API_KEY is not configured. Set it in your Vercel Environment Variables (Settings → Environment Variables) or in .env.local for local dev.',
      );
    }

    const client = new GoogleGenerativeAI(apiKey);
    this._model = client.getGenerativeModel({ model: 'gemini-2.0-flash' });
    return this._model;
  }

  /**
   * System prompt that frames Gemini as an interactive math tutor
   * that can handle follow-up doubts and respond in Roman Urdu when needed.
   */
  private static TUTOR_SYSTEM = `You are "MathLab AI Tutor" — an expert, friendly math tutor who helps students UNDERSTAND math, not just copy answers.

RULES:
1. Always solve step-by-step. For every step include: what you did, the math expression, WHY you did it, and the concept name in English + Urdu.
2. If the student writes in Roman Urdu (e.g. "yeh step kyun kiya"), you MUST reply fully in Roman Urdu so they understand clearly. Otherwise reply in English.
3. When a student asks a follow-up doubt about a previous step, refer back to that step and explain deeper.
4. For images/PDFs: first describe what you see, extract the math, then solve.
5. Be encouraging — say things like "Great question!" or "Bohat acha sawaal hai!"

RESPONSE FORMAT — always return valid JSON:
{
  "steps": [
    {
      "description": "Short step title",
      "math": "x = (-b ± √(b²-4ac)) / 2a",
      "explanation": "Clear explanation of why this step is done",
      "concept": "Quadratic Formula",
      "conceptUrdu": "Quadratic Formula (دوسری درجے کا فارمولا)"
    }
  ],
  "answer": "Final answer here",
  "summary": "Brief explanation of the solution method used",
  "language": "en or ur (detected from student input)"
}

If the student is asking a follow-up doubt (not a new problem), respond with:
{
  "isFollowUp": true,
  "explanation": "Detailed explanation addressing their doubt",
  "language": "en or ur"
}`;

  /**
   * Conversational tutor – accepts full conversation history + optional file.
   */
  static async tutorChat(
    conversationHistory: TutorMessage[],
    currentMessage: string,
    fileBase64?: string,
    fileMimeType?: string,
    fileUrl?: string,
  ) {
    try {
      // Build Gemini-compatible history
      const history: Content[] = conversationHistory.map((msg) => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: msg.text ? [{ text: msg.text }] : [],
      }));

      // Start chat with system context baked into history
      const chat = this.getModel().startChat({
        history: [
          { role: 'user', parts: [{ text: this.TUTOR_SYSTEM }] },
          { role: 'model', parts: [{ text: 'Understood! I am MathLab AI Tutor. I will follow all the rules. Ready to help!' }] },
          ...history,
        ],
      });

      // Build current message parts (text + optional file)
      const parts: any[] = [];

      if (fileBase64 && fileMimeType) {
        parts.push({
          inlineData: {
            mimeType: fileMimeType,
            data: fileBase64,
          },
        });
        const urlCtx = fileUrl ? ` (Uploaded file URL: ${fileUrl})` : '';
        parts.push({
          text: currentMessage || `Please analyze this document/image${urlCtx}, extract any math problems, and solve them step-by-step.`,
        });
      } else {
        parts.push({ text: currentMessage });
      }

      const result = await chat.sendMessage(parts);
      const text = result.response.text();

      // Parse JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        // If AI didn't return JSON, wrap the plain text
        return {
          isFollowUp: true,
          explanation: text,
          language: 'en',
        };
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Tutor chat error:', error);
      throw new Error('Failed to get tutor response');
    }
  }

  /**
   * Legacy: simple single-shot solve (kept for backward compat).
   */
  static async solveMathProblem(problem: string) {
    return this.tutorChat([], problem);
  }

  /**
   * Legacy: extract math from image (kept for backward compat).
   */
  static async extractMathFromImage(imageFile: File) {
    try {
      const imageData = await this.fileToBase64(imageFile);
      const base64Image = imageData.split(',')[1];

      const result = await this.getModel().generateContent([
        {
          inlineData: {
            mimeType: imageFile.type,
            data: base64Image,
          },
        },
        {
          text: 'Extract the math problem from this image and return it as plain text. If there are multiple problems, separate them with newlines.',
        },
      ]);

      return result.response.text();
    } catch (error) {
      console.error('OCR error:', error);
      throw new Error('Failed to extract text from image');
    }
  }

  private static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
