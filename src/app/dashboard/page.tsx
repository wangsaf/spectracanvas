'use client';

import Link from 'next/link';
import { useProjectStore } from '@/store/project-store';

const quickStarts = [
  {
    id: 'brand',
    title: 'BRAND STUDIO',
    description: 'Generate colors, typography, logos, and mockups.',
    href: '/create/brand',
    color: '#ff6b6b',
  },
  {
    id: 'pixel',
    title: 'PIXEL STUDIO',
    description: 'Create pixel art sprites, animations, and sheets.',
    href: '/create/pixel',
    color: '#00ff88',
  },
  {
    id: 'content',
    title: 'CONTENT STUDIO',
    description: 'Scripts, storyboards, captions, and calendars.',
    href: '/create/content',
    color: '#4dabf7',
  },
];

export default function DashboardPage() {
  const { projects } = useProjectStore();

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="font-mono text-xs text-[#555] mb-2">// DASHBOARD</div>
          <h1 className="font-mono text-2xl md:text-3xl tracking-wider">
            WELCOME BACK
          </h1>
          <p className="font-mono text-sm text-[#888] mt-2">
            Choose a module to start creating, or continue where you left off.
          </p>
        </div>

        {/* Quick Start */}
        <section className="mb-12">
          <h2 className="font-mono text-sm text-[#555] tracking-wider mb-4">
            // QUICK START
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickStarts.map((qs) => (
              <Link key={qs.id} href={qs.href}>
                <div className="border border-[#222] bg-[#111] p-6 hover:border-[#00ff88] transition-colors group">
                  <div
                    className="font-mono text-xs mb-2"
                    style={{ color: qs.color }}
                  >
                    [{'> '}] {qs.title}
                  </div>
                  <p className="font-mono text-xs text-[#888] mb-4">
                    {qs.description}
                  </p>
                  <div className="font-mono text-xs text-[#00ff88] opacity-0 group-hover:opacity-100 transition-opacity">
                    [ OPEN ]
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Projects */}
        <section>
          <h2 className="font-mono text-sm text-[#555] tracking-wider mb-4">
            // RECENT PROJECTS
          </h2>

          {projects.length === 0 ? (
            <div className="border border-[#222] bg-[#111] p-12 text-center">
              <pre className="font-mono text-[#333] text-xs mb-4">
{`    +--+
    |  |
    +--+
   /    \\
  +------+
  |      |
  +------+`}
              </pre>
              <p className="font-mono text-sm text-[#555] mb-2">
                NO PROJECTS YET
              </p>
              <p className="font-mono text-xs text-[#444]">
                Create your first brand, pixel art, or content above.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {projects.map((project) => (
                <Link key={project.id} href={`/project/${project.id}`}>
                  <div className="border border-[#222] bg-[#111] p-4 hover:border-[#00ff88] transition-colors flex items-center justify-between">
                    <div>
                      <div className="font-mono text-sm text-white">
                        {project.name}
                      </div>
                      <div className="font-mono text-xs text-[#555] mt-1">
                        {project.type.toUpperCase()} // {project.createdAt}
                      </div>
                    </div>
                    <div className="font-mono text-xs text-[#00ff88]">
                      [ VIEW ]
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Navigation Links */}
        <div className="mt-8 flex gap-4">
          <Link
            href="/demo"
            className="font-mono text-xs text-[#555] hover:text-[#00ff88] transition-colors"
          >
            [ VIEW DEMOS ]
          </Link>
          <Link
            href="/"
            className="font-mono text-xs text-[#555] hover:text-[#00ff88] transition-colors"
          >
            [ HOME ]
          </Link>
        </div>
      </div>
    </div>
  );
}
