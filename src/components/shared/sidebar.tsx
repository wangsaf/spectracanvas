'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { SidebarItem } from '@/lib/types';

interface SidebarProps {
  items: SidebarItem[];
  title?: string;
  className?: string;
}

export function Sidebar({ items, title, className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'w-56 min-h-screen bg-[#0a0a0a] border-r-2 border-[#222] flex flex-col pt-4',
        className
      )}
    >
      {title && (
        <div className="px-4 pb-4 border-b-2 border-[#222]">
          <h2 className="font-mono text-sm font-bold text-gray-400 tracking-widest uppercase">
            -- {title} --
          </h2>
        </div>
      )}

      <nav className="flex-1 py-2">
        <ul className="space-y-1">
          {items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2 font-mono text-sm transition-colors border-l-4',
                    isActive
                      ? 'bg-[#111] text-white border-white'
                      : 'text-gray-500 hover:text-white hover:bg-[#111] border-transparent'
                  )}
                >
                  {item.icon && (
                    <span className="text-xs w-4 text-center">{item.icon}</span>
                  )}
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="px-4 py-4 border-t-2 border-[#222]">
        <p className="font-mono text-xs text-gray-600">
          v1.0.0
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
