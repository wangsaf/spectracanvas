'use client';

import Link from 'next/link';

export default function ProjectPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-mono p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <Link href="/dashboard" className="text-xs text-neutral-500 hover:text-white">← BACK</Link>
        <h1 className="text-2xl tracking-wider mt-4">PROJECT VIEW</h1>
        <p className="text-sm text-neutral-400 mt-2">Project details coming soon.</p>
      </div>
    </div>
  );
}
