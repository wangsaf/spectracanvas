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
    <div className="min-h-screen bg-[#000000] flex">
      <aside className="w-48 border-r border-[#27272a] bg-[#000000] p-4 flex-shrink-0 hidden md:block">
        <Link href="/dashboard" className="text-xs text-[#71717a] hover:text-[#ffffff] block mb-4">
          ← DASHBOARD
        </Link>
        <div className="text-xs text-[#71717a] mb-3">// STUDIO</div>
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={"block py-2 px-3 text-xs mb-1 border-l-2 " + (pathname === link.href ? "border-[#ffffff] text-[#ffffff]" : "border-transparent text-[#71717a] hover:text-[#ffffff]")}
          >
            {link.label}
          </Link>
        ))}
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
