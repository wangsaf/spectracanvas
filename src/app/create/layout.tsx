'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const links = [
    { href: '/create/brand', label: 'BRAND' },
    { href: '/create/pixel', label: 'PIXEL' },
    { href: '/create/content', label: 'CONTENT' },
  ];

  return (
    <div className="min-h-screen bg-[#1c1915] flex">
      <aside className="w-48 border-r border-[#3a322a] bg-[#1c1915] p-4 flex-shrink-0 hidden md:block">
        <Link href="/dashboard" className="text-xs text-[#6b5f52] hover:text-[#f0e8dc] block mb-4">
          ← DASHBOARD
        </Link>
        <div className="text-xs text-[#6b5f52] mb-3">// STUDIO</div>
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={"block py-2 px-3 text-xs mb-1 border-l-2 " + (pathname === link.href ? "border-[#d9453b] text-[#d9453b]" : "border-transparent text-[#6b5f52] hover:text-[#f0e8dc]")}
          >
            {link.label}
          </Link>
        ))}
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
