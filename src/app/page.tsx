'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const GlobeHero = dynamic(() => import('@/components/shared/globe-hero').then(m => m.GlobeHero), { ssr: false });

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: '#1c1915', color: '#f0e8dc', fontFamily: "'DM Sans', 'Space Grotesk', system-ui, sans-serif" }}>
      {/* Globe Hero */}
      <GlobeHero />

      {/* Features */}
      <div className="max-w-5xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p
            className="text-[10px] font-bold tracking-[3px] mb-3"
            style={{ color: '#d9453b', fontFamily: "'Space Grotesk', monospace" }}
          >
            THREE STUDIOS
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold"
            style={{ fontFamily: "'Instrument Serif', serif", color: '#f0e8dc' }}
          >
            Everything you need to build a brand
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { letter: 'B', title: 'BRAND', desc: 'Colors, fonts, logos — define your visual identity in seconds.', href: '/dashboard?tab=brand' },
            { letter: 'P', title: 'PIXEL', desc: 'Sprites, sheets, poses — game-ready assets from a description.', href: '/dashboard?tab=pixel' },
            { letter: 'C', title: 'CONTENT', desc: 'Scripts for TikTok, IG, YT — with hooks, timestamps, CTAs.', href: '/dashboard?tab=content' },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link
                href={f.href}
                className="block p-7 transition-all group h-full"
                style={{
                  border: '1px solid #3a322a',
                  borderRadius: '8px',
                  background: '#241f1a',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#d9453b';
                  e.currentTarget.style.background = '#2e2720';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#3a322a';
                  e.currentTarget.style.background = '#241f1a';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div
                  className="w-10 h-10 flex items-center justify-center mb-5"
                  style={{ border: '1px solid #d9453b', borderRadius: '6px', background: 'rgba(217,69,59,0.1)' }}
                >
                  <span
                    className="font-bold text-lg"
                    style={{ color: '#d9453b', fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {f.letter}
                  </span>
                </div>
                <h3
                  className="text-sm font-bold tracking-wider mb-2"
                  style={{ fontFamily: "'Space Grotesk', monospace", color: '#f0e8dc' }}
                >
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#6b5f52' }}>
                  {f.desc}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p
            className="text-[10px] font-bold tracking-[3px] mb-3"
            style={{ color: '#d9453b', fontFamily: "'Space Grotesk', monospace" }}
          >
            HOW IT WORKS
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold"
            style={{ fontFamily: "'Instrument Serif', serif", color: '#f0e8dc' }}
          >
            From idea to output in three steps
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Define your brand', desc: 'Enter a name and vibe. Get colors, fonts, and a logo in seconds.' },
            { step: '02', title: 'Create pixel art', desc: 'Describe a character. Choose a style. Download game-ready sprites.' },
            { step: '03', title: 'Write content', desc: 'Pick a platform and tone. Get scripts with hooks, timestamps, and CTAs.' },
          ].map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="text-center"
            >
              <div
                className="text-3xl font-bold mb-3"
                style={{ color: '#d9453b', fontFamily: "'JetBrains Mono', monospace" }}
              >
                {s.step}
              </div>
              <h3 className="text-base font-bold mb-2" style={{ color: '#f0e8dc' }}>
                {s.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#6b5f52' }}>
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="p-8 md:p-10"
          style={{
            border: '1px solid #3a322a',
            borderRadius: '8px',
            background: '#241f1a',
          }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '3', label: 'STUDIOS' },
              { value: '8', label: 'MOODS' },
              { value: '4', label: 'PLATFORMS' },
              { value: 'FREE', label: 'ALWAYS' },
            ].map((s) => (
              <div key={s.label}>
                <div
                  className="text-3xl md:text-4xl font-bold mb-1"
                  style={{ color: '#d9453b', fontFamily: "'Instrument Serif', serif" }}
                >
                  {s.value}
                </div>
                <div
                  className="text-[10px] tracking-[3px]"
                  style={{ color: '#6b5f52', fontFamily: "'Space Grotesk', monospace" }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto px-6 pb-20 text-center"
      >
        <p className="text-lg mb-2" style={{ color: '#f0e8dc', fontFamily: "'Instrument Serif', serif" }}>
          Ready to create?
        </p>
        <p className="text-sm mb-6" style={{ color: '#6b5f52' }}>
          No sign-up required. Start building your brand right now.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold tracking-wider transition-all"
          style={{
            background: '#d9453b',
            color: '#fff',
            borderRadius: '4px',
            fontFamily: "'Space Grotesk', monospace",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#b8382f';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#d9453b';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          START CREATING
        </Link>
      </motion.div>

      {/* Footer */}
      <footer className="py-8 text-center" style={{ borderTop: '1px solid #3a322a' }}>
        <div className="flex justify-center gap-1 mb-4">
          {[...Array(24)].map((_, i) => (
            <div
              aria-hidden="true"
              key={i}
              className="w-2 h-2"
              style={{ background: i % 3 === 0 ? '#d9453b' : '#3a322a', borderRadius: '2px' }}
            />
          ))}
        </div>
        <p
          className="text-xs"
          style={{ color: '#6b5f52', fontFamily: "'Space Grotesk', monospace" }}
        >
          Team Spectriad - Three Mind One Solution - IBM AI Builders Challenge 2026
        </p>
      </footer>
    </div>
  );
}
