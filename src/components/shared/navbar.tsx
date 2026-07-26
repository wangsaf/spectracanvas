'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useProjectStore, calculateProjectCompletion } from '@/lib/store/project-store';

export function Navbar() {
  const pathname = usePathname();
  const { projectName } = useProjectStore();
  const completion = calculateProjectCompletion(useProjectStore.getState());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'HOME' },
    { href: '/dashboard', label: 'DASHBOARD' },
    { href: '/create/brand', label: 'BRAND' },
    { href: '/create/pixel', label: 'PIXEL' },
    { href: '/create/content', label: 'CONTENT' },
  ];

  return (
    <nav className="sticky top-0 z-50" style={{ borderBottom: '2px solid #3a322a', background: '#1c1915ee', backdropFilter: 'blur(8px)' }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 flex items-center justify-center" style={{ background: '#d9453b', borderRadius: '4px' }}>
              <span className="font-bold text-sm text-white">S</span>
            </div>
            <span className="font-bold text-sm tracking-widest" style={{ color: '#f0e8dc', fontFamily: "'Space Grotesk', monospace" }}>SPECTRACANVAS</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-1.5 text-xs font-bold tracking-wider transition-all"
                  style={{
                    borderRadius: '4px',
                    fontFamily: "'Space Grotesk', monospace",
                    background: isActive ? '#d9453b' : 'transparent',
                    color: isActive ? '#fff' : '#a09484',
                  }}
                  onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.color = '#f0e8dc'; e.currentTarget.style.background = '#241f1a'; } }}
                  onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.color = '#a09484'; e.currentTarget.style.background = 'transparent'; } }}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Project Info */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs" style={{ color: '#6b5f52', fontFamily: "'Space Grotesk', monospace", letterSpacing: '1px' }}>PROJECT</p>
              <p className="text-xs font-bold" style={{ color: '#f0e8dc' }}>{projectName}</p>
            </div>
            <div className="w-10 h-10 flex items-center justify-center" style={{ border: '2px solid #3a322a', borderRadius: '4px' }}>
              <span className="text-xs font-bold" style={{ color: '#d9453b', fontFamily: "'JetBrains Mono', monospace" }}>{completion}%</span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 transition-colors"
            style={{ color: '#f0e8dc', borderRadius: '4px' }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-1" style={{ borderTop: '1px solid #3a322a' }}>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 text-xs font-bold tracking-wider transition-colors"
                  style={{
                    borderRadius: '4px',
                    fontFamily: "'Space Grotesk', monospace",
                    background: isActive ? '#d9453b' : 'transparent',
                    color: isActive ? '#fff' : '#a09484',
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="px-4 pt-3 mt-3" style={{ borderTop: '1px solid #3a322a' }}>
              <p className="text-xs" style={{ color: '#6b5f52' }}>PROJECT: {projectName}</p>
              <p className="text-xs font-bold" style={{ color: '#d9453b' }}>{completion}%</p>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
