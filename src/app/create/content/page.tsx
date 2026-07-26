'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ContentStudioPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard?tab=content');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#1c1915] flex items-center justify-center">
      <p className="text-xs text-[#6b5f52] tracking-wider">REDIRECTING...</p>
    </div>
  );
}
