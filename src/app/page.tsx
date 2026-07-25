'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const features = [
  {
    id: 'brand',
    title: 'BRAND STUDIO',
    description: 'Generate complete brand identities: colors, typography, logos, and mockups.',
    icon: `  ____  \n |    | \n | __ | \n ||  || \n ||__|| \n |____|`,
    href: '/create/brand',
  },
  {
    id: 'pixel',
    title: 'PIXEL STUDIO',
    description: 'Create pixel art sprites, animations, and sprite sheets for your projects.',
    icon: `  [][][]\n [][][] \n[][][]  \n [][][] \n  [][][]\n [][][] `,
    href: '/create/pixel',
  },
  {
    id: 'content',
    title: 'CONTENT STUDIO',
    description: 'Scripts, storyboards, captions, and content calendars powered by AI.',
    icon: ` +------+ \n | >_   | \n |      | \n | ==== | \n |      | \n +------+`,
    href: '/create/content',
  },
  {
    id: 'mood',
    title: 'MOOD BOARD',
    description: 'AI-curated mood boards for visual direction and creative inspiration.',
    icon: ` [##][##]\n [##]   \n    [##]\n [##]   \n [##][##]\n [##][##]`,
    href: '/demo',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <pre className="font-mono text-[#00ff88] text-xs md:text-sm mb-8 select-none">
{`
  ____  ____  ____  ____  ____  ____  ____  ____  ____  ____  ____  ____
 / ___\\/ ___\\/ ___\\/ ___\\/ ___\\/ ___\\/ ___\\/ ___\\/ ___\\/ ___\\/ ___\\/ ___\\
/ /___/ /___/ /___/ /___/ /___/ /___/ /___/ /___/ /___/ /___/ /___/ /___/
\\____/\\____/\\____/\\____/\\____/\\____/\\____/\\____/\\____/\\____/\\____/\\____/
`}
          </pre>

          <h1 className="font-mono text-4xl md:text-6xl lg:text-7xl font-bold tracking-wider mb-4">
            SPECTRACANVAS
          </h1>

          <p className="font-mono text-[#888] text-lg md:text-xl mb-2 tracking-widest">
            YOUR CREATIVE SPECTRUM, ONE CANVAS
          </p>

          <p className="font-mono text-[#555] text-sm md:text-base mb-12 max-w-2xl mx-auto">
            Brand identities. Pixel art. Content creation. All powered by AI,
            all on a single canvas. No bloat. Just creation.
          </p>

          <Link
            href="/dashboard"
            className="inline-block font-mono text-lg px-8 py-4 bg-[#00ff88] text-[#0a0a0a] hover:bg-[#00cc6a] transition-colors tracking-wider"
          >
            [ ENTER CANVAS ]
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="px-4 pb-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-mono text-2xl md:text-3xl tracking-wider mb-4">
            // MODULES
          </h2>
          <div className="w-24 h-[2px] bg-[#00ff88] mx-auto" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {features.map((feature) => (
            <motion.div key={feature.id} variants={itemVariants}>
              <Link href={feature.href} className="block group">
                <div className="border border-[#222] bg-[#111] p-6 hover:border-[#00ff88] transition-colors h-full">
                  <pre className="font-mono text-[#00ff88] text-xs leading-tight mb-4 opacity-70 group-hover:opacity-100 transition-opacity">
                    {feature.icon}
                  </pre>
                  <h3 className="font-mono text-sm tracking-wider mb-3 text-white">
                    {feature.title}
                  </h3>
                  <p className="font-mono text-xs text-[#888] leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="mt-4 font-mono text-xs text-[#00ff88]">
                    [ OPEN ]
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="px-4 pb-24">
        <div className="max-w-4xl mx-auto border border-[#222] bg-[#111] p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'MODULES', value: '4' },
              { label: 'API ROUTES', value: '12+' },
              { label: 'EXPORTS', value: 'PNG/SVG/ZIP' },
              { label: 'DEPENDENCIES', value: '0 BLOAT' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-mono text-2xl md:text-3xl text-[#00ff88] mb-2">
                  {stat.value}
                </div>
                <div className="font-mono text-xs text-[#555] tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#222] py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-mono text-xs text-[#555]">
            TEAM SPECTRIAD // 2024
          </div>
          <div className="font-mono text-xs text-[#333]">
            BUILT WITH NEXT.JS + AI // NO COOKIE CUTTER TEMPLATE
          </div>
          <div className="font-mono text-xs text-[#555]">
            SPECTRACANVAS v0.1.0
          </div>
        </div>
      </footer>
    </div>
  );
}
