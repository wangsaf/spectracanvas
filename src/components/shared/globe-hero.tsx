'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Floating geometric shapes
const floatingShapes = [
  { size: 60, color: '#d9453b', opacity: 0.12, left: '15%', top: '20%', delay: 0, shape: 'circle' },
  { size: 40, color: '#f0e8dc', opacity: 0.08, left: '75%', top: '35%', delay: 2, shape: 'square' },
  { size: 80, color: '#d9453b', opacity: 0.06, left: '60%', top: '65%', delay: 4, shape: 'circle' },
  { size: 50, color: '#f0e8dc', opacity: 0.1, left: '25%', top: '70%', delay: 1, shape: 'square' },
];

// Character reveal for headline
const headlineWords = [
  { text: 'Create.', color: '#f0e8dc' },
  { text: 'Design.', color: '#f0e8dc' },
  { text: 'Ship.', color: '#d9453b' },
];

export function GlobeHero() {
  const [headlineRevealed, setHeadlineRevealed] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  const fullText = headlineWords.map(w => w.text).join(' ');

  useEffect(() => {
    if (charIndex < fullText.length) {
      const timer = setTimeout(() => {
        setCharIndex(prev => prev + 1);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setHeadlineRevealed(true);
    }
  }, [charIndex, fullText.length]);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ background: '#1c1915', minHeight: '90vh' }}
    >
      {/* Animated gradient mesh background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 20% 40%, rgba(217,69,59,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 80% 60%, rgba(217,69,59,0.04) 0%, transparent 60%),
            radial-gradient(ellipse 50% 50% at 50% 50%, rgba(217,69,59,0.05) 0%, transparent 70%)
          `,
          animation: 'gradientShift 18s ease-in-out infinite',
        }}
      />

      {/* Dot grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle at center, rgba(240,232,220,0.08) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Floating shapes */}
      {floatingShapes.map((shape, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{
            width: shape.size,
            height: shape.size,
            left: shape.left,
            top: shape.top,
            background: shape.color,
            opacity: shape.opacity,
            borderRadius: shape.shape === 'circle' ? '50%' : '4px',
          }}
          animate={{
            y: [0, -30, 0, 20, 0],
            x: [0, 15, 0, -15, 0],
            rotate: shape.shape === 'square' ? [0, 90, 180, 270, 360] : 0,
          }}
          transition={{
            duration: 20 + i * 3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: shape.delay,
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="max-w-2xl">
          {/* Badge pill with shimmer border */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 relative"
            style={{
              border: '1px solid #3a322a',
              borderRadius: '999px',
              background: 'rgba(36,31,26,0.8)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {/* Shimmer effect on border */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(217,69,59,0.3) 50%, transparent 100%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 3s ease-in-out infinite',
                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                maskComposite: 'exclude',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                padding: '1px',
              }}
            />
            <span
              className="w-1.5 h-1.5 rounded-full inline-block"
              style={{ background: '#d9453b' }}
            />
            <span
              className="text-[10px] font-bold tracking-[3px]"
              style={{
                color: '#a09484',
                fontFamily: "'Space Grotesk', monospace",
              }}
            >
              AI-POWERED CREATIVE SUITE
            </span>
          </motion.div>

          {/* Headline with character reveal */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-6"
            style={{
              fontFamily: "'Instrument Serif', serif",
              color: '#f0e8dc',
              letterSpacing: '-2px',
            }}
          >
            {headlineWords.map((word, wi) => {
              const wordsBefore = headlineWords.slice(0, wi).map(w => w.text).join('');
              const offset = wordsBefore.length + wi; // +wi for spaces
              return (
                <span key={wi} className="inline-block mr-3">
                  {word.text.split('').map((char, ci) => {
                    const globalIndex = offset + ci;
                    return (
                      <span
                        key={ci}
                        style={{
                          opacity: globalIndex < charIndex ? 1 : 0,
                          color: word.color,
                          transition: 'opacity 0.1s ease',
                        }}
                      >
                        {char}
                      </span>
                    );
                  })}
                </span>
              );
            })}
          </motion.h1>

          {/* Subtitle */}
          <AnimatePresence>
            {headlineRevealed && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-base md:text-lg max-w-lg mb-10 leading-relaxed"
                style={{ color: '#a09484', fontFamily: "'DM Sans', sans-serif" }}
              >
                Brand identity, pixel art, and content scripts — all in one canvas.
              </motion.p>
            )}
          </AnimatePresence>

          {/* CTAs */}
          <AnimatePresence>
            {headlineRevealed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  href="/dashboard"
                  className="group inline-flex items-center gap-2 px-7 py-3.5 text-sm font-bold tracking-wider transition-all hover:-translate-y-0.5"
                  style={{
                    background: '#d9453b',
                    color: '#fff',
                    borderRadius: '4px',
                    fontFamily: "'Space Grotesk', monospace",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#b8382f';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(217,69,59,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#d9453b';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Start Creating
                  <svg
                    aria-hidden="true"
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>

                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-bold tracking-wider transition-all hover:-translate-y-0.5"
                  style={{
                    border: '1px solid #3a322a',
                    color: '#f0e8dc',
                    borderRadius: '4px',
                    fontFamily: "'Space Grotesk', monospace",
                    background: 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#6b5f52';
                    e.currentTarget.style.background = 'rgba(36,31,26,0.5)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(58,50,42,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#3a322a';
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  View Demo
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #1c1915, transparent)' }}
      />

      {/* Inline keyframes */}
      <style jsx global>{`
        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          25% {
            background-position: 50% 0%;
          }
          50% {
            background-position: 100% 50%;
          }
          75% {
            background-position: 50% 100%;
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </section>
  );
}
