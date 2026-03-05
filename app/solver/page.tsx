'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SolverPage() {
  const router = useRouter();
  useEffect(() => { router.replace('/dashboard'); }, [router]);
  return (
    <div className="flex-1 flex items-center justify-center min-h-screen bg-deep">
      <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
