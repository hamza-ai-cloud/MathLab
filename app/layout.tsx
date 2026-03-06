import type { Metadata } from 'next';
import { Providers } from '@/components/shared/Providers';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'MathLab — AI-Powered Math Solver',
  description:
    'Solve complex math problems with AI-powered step-by-step guidance. From algebra to calculus, powered by MathLab AI.',
  keywords: ['math solver', 'AI', 'step by step', 'calculus', 'algebra', 'MathLab'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-deep text-white antialiased">
        {/* Global mesh gradient background */}
        <div className="mesh-gradient" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
