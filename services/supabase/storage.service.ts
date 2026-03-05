import { createClient } from '@/lib/supabase/client';

const BUCKET = 'math-uploads';
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export interface UploadResult {
  url: string;
  path: string;
  name: string;
  size: number;
  mimeType: string;
}

export class StorageService {
  /**
   * Upload a file to Supabase Storage with real-time progress tracking.
   * Uses XMLHttpRequest so the browser fires `progress` events.
   */
  static async uploadWithProgress(
    file: File,
    onProgress?: (percent: number) => void,
  ): Promise<UploadResult> {
    if (file.size > MAX_SIZE) {
      throw new Error(`File size exceeds ${MAX_SIZE / (1024 * 1024)} MB limit`);
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const path = `uploads/${safeName}`;

    return new Promise((resolve, reject) => {
      const supabase = createClient();
      supabase.auth.getSession().then(({ data: { session } }) => {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        const token = session?.access_token || anonKey;

        const xhr = new XMLHttpRequest();
        const url = `${supabaseUrl}/storage/v1/object/${BUCKET}/${path}`;

        xhr.open('POST', url, true);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.setRequestHeader('apikey', anonKey);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.setRequestHeader('x-upsert', 'true');

        // ── Real-time progress ──
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable && onProgress) {
            onProgress(Math.round((e.loaded / e.total) * 100));
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const publicUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${path}`;
            onProgress?.(100);
            resolve({ url: publicUrl, path, name: file.name, size: file.size, mimeType: file.type });
          } else {
            reject(new Error(`Upload failed: ${xhr.statusText} (${xhr.status})`));
          }
        });

        xhr.addEventListener('error', () => reject(new Error('Upload failed: network error')));
        xhr.addEventListener('abort', () => reject(new Error('Upload aborted')));

        xhr.send(file);
      });
    });
  }

  /**
   * Convenience helper — read a File as pure base64 (no data-url prefix).
   * Used to send inline data to the Gemini API alongside the Supabase URL.
   */
  static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // strip "data:…;base64,"
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
