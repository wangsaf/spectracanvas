'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/', label: 'HOME' },
  { href: '/create', label: 'CREATE' },
  { href: '/gallery', label: 'GALLERY' },
  { href: '/about', label: 'ABOUT' },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a] border-b-2 border-[#222]">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-mono text-lg font-bold text-white tracking-widest hover:text-purple-400 transition-colors"
        >
          {'>'} SPECTRACANVAS
        </Link>

        <ul className="flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'font-mono text-sm px-3 py-2 border-2 border-transparent transition-colors',
                    isActive
                      ? 'bg-white text-[#0a0a0a] border-white'
                      : 'text-gray-400 hover:text-white hover:border-[#333] border-[#222]'
                  )}
                >
                  [{link.label}]
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
