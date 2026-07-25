'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useProjectStore, calculateProjectCompletion } from '@/lib/store/project-store';

export function Navbar() {
  const pathname = usePathname();
  const { projectName } = useProjectStore();
  const completion = calculateProjectCompletion(useProjectStore.getState());

  const navItems = [
    { href: '/', label: 'HOME' },
    { href: '/dashboard', label: 'DASHBOARD' },
    { href: '/create/brand', label: 'BRAND' },
    { href: '/create/pixel', label: 'PIXEL' },
    { href: '/create/content', label: 'CONTENT' },
  ];

  return (
    <nav className="border-b border-[#222] bg-[#0a0a0a] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#00ff88] flex items-center justify-center">
              <span className="text-black font-bold text-lg">S</span>
            </div>
            <span className="font-bold tracking-wider text-white">SPECTRACANVAS</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 text-xs font-bold tracking-wider transition-colors ${
                    isActive
                      ? 'bg-[#00ff88] text-black'
                      : 'text-neutral-400 hover:text-white hover:bg-[#111]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Project Info */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-neutral-500">PROJECT</p>
              <p className="text-xs font-bold text-white">{projectName}</p>
            </div>
            <div className="w-12 h-12 border border-[#222] flex items-center justify-center">
              <span className="text-xs font-bold text-[#00ff88]">{completion}%</span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="square"
                strokeLinejoin="miter"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
