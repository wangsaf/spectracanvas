'use client';

import { motion } from 'framer-motion';

export function GlobeHero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: '#000000' }}>
      {/* Animated gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 70% 50%, rgba(255,255,255,0.1) 0%, transparent 60%), radial-gradient(ellipse at 30% 50%, rgba(240,232,220,0.04) 0%, transparent 50%)',
        }}
      />

      {/* Dot grid overlay */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: 'radial-gradient(circle at center, #27272a 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Decorative floating shapes */}
      <div className="absolute right-10 top-1/4 w-64 h-64 opacity-10" style={{ filter: 'blur(60px)' }}>
        <div className="w-full h-full rounded-full" style={{ background: '#ffffff' }} />
      </div>
      <div className="absolute right-40 bottom-1/4 w-40 h-40 opacity-5" style={{ filter: 'blur(40px)' }}>
        <div className="w-full h-full rounded-full" style={{ background: '#ffffff' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#ffffff', animation: 'pulse 2s infinite' }} />
            <span className="text-xs font-bold tracking-wider" style={{ color: '#ffffff', fontFamily: "'Space Grotesk', monospace" }}>
              AI-POWERED CREATIVE SUITE
            </span>
          </motion.div>

          {/* Headline */}
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight"
              style={{ fontFamily: "'Instrument Serif', serif", color: '#fafafa' }}
            >
              Create.{' '}
              <span style={{ color: '#a1a1aa' }}>Design.</span>{' '}
              <span style={{ color: '#ffffff' }}>Ship.</span>
            </motion.h1>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-lg md:text-xl max-w-lg"
            style={{ color: '#a1a1aa', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.7 }}
          >
            Brand identity, pixel art, and content scripts — all in one canvas. Powered by IBM watsonx.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <a
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold tracking-wider rounded transition-all hover:-translate-y-0.5"
              style={{
                background: '#ffffff',
                color: '#fff',
                fontFamily: "'Space Grotesk', monospace",
                boxShadow: '0 4px 20px rgba(255,255,255,0.3)',
              }}
            >
              Start Creating
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a
              href="/demo"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold tracking-wider rounded transition-all hover:-translate-y-0.5"
              style={{
                border: '1px solid #27272a',
                color: '#a1a1aa',
                fontFamily: "'Space Grotesk', monospace",
                background: 'transparent',
              }}
            >
              View Demo
            </a>
          </motion.div>
        </motion.div>
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.5); }
      `}</style>
    </section>
  );
}
