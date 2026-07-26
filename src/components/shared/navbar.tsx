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
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/create/brand', label: 'Brand' },
    { href: '/create/pixel', label: 'Pixel' },
    { href: '/create/content', label: 'Content' },
  ];

  const isHome = pathname === '/';

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        borderBottom: '1px solid rgba(58,50,42,0.5)',
        background: 'rgba(28,25,21,0.7)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 flex items-center justify-center"
              style={{ background: '#d9453b', borderRadius: '6px' }}
            >
              <span className="font-bold text-sm text-white" style={{ fontFamily: "'Space Grotesk', monospace" }}>S</span>
            </div>
            <span
              className="font-bold text-sm tracking-widest hidden sm:inline"
              style={{ color: '#f0e8dc', fontFamily: "'Space Grotesk', monospace" }}
            >
              SPECTRACANVAS
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3.5 py-1.5 text-xs font-medium tracking-wide transition-all"
                  style={{
                    borderRadius: '6px',
                    fontFamily: "'DM Sans', sans-serif",
                    background: isActive ? 'rgba(217,69,59,0.15)' : 'transparent',
                    color: isActive ? '#d9453b' : '#a09484',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#f0e8dc';
                      e.currentTarget.style.background = 'rgba(58,50,42,0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#a09484';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right side: Project info + CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="text-right">
              <p
                className="text-[9px] tracking-[2px]"
                style={{ color: '#6b5f52', fontFamily: "'Space Grotesk', monospace" }}
              >
                PROJECT
              </p>
              <p className="text-xs font-medium" style={{ color: '#f0e8dc' }}>
                {projectName}
              </p>
            </div>
            <div
              className="w-9 h-9 flex items-center justify-center"
              style={{
                border: '1px solid #3a322a',
                borderRadius: '6px',
                background: 'rgba(36,31,26,0.5)',
              }}
            >
              <span
                className="text-[10px] font-bold"
                style={{ color: '#d9453b', fontFamily: "'JetBrains Mono', monospace" }}
              >
                {completion}%
              </span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 transition-colors"
            style={{ color: '#f0e8dc', borderRadius: '6px' }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-1" style={{ borderTop: '1px solid rgba(58,50,42,0.5)' }}>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm transition-colors"
                  style={{
                    borderRadius: '6px',
                    fontFamily: "'DM Sans', sans-serif",
                    background: isActive ? 'rgba(217,69,59,0.15)' : 'transparent',
                    color: isActive ? '#d9453b' : '#a09484',
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="px-4 pt-3 mt-3" style={{ borderTop: '1px solid rgba(58,50,42,0.5)' }}>
              <p className="text-xs" style={{ color: '#6b5f52' }}>PROJECT: {projectName}</p>
              <p className="text-xs font-bold" style={{ color: '#d9453b' }}>{completion}%</p>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
