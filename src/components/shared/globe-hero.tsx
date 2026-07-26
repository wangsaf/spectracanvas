'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';
import Link from 'next/link';
import * as THREE from 'three';

// Generate points on a sphere surface
function generateGlobePoints(count: number, radius: number) {
  const points: [number, number, number][] = [];
  const phi = Math.PI * (Math.sqrt(5) - 1); // golden angle
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    points.push([
      Math.cos(theta) * r * radius,
      y * radius,
      Math.sin(theta) * r * radius,
    ]);
  }
  return points;
}

// Generate connection lines between nearby points
function generateConnections(
  points: [number, number, number][],
  maxDist: number
) {
  const lines: [number, number, number][][] = [];
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const dx = points[i][0] - points[j][0];
      const dy = points[i][1] - points[j][1];
      const dz = points[i][2] - points[j][2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist < maxDist) {
        lines.push([points[i], points[j]]);
      }
    }
  }
  return lines;
}

function GlobeDots() {
  const groupRef = useRef<THREE.Group>(null);
  const points = useMemo(() => generateGlobePoints(180, 2), []);
  const connections = useMemo(() => generateConnections(points, 0.65), [points]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.12;
      groupRef.current.rotation.x = Math.sin(Date.now() * 0.0002) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Dots */}
      {points.map((pos, i) => (
        <mesh key={`dot-${i}`} position={pos}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial
            color={i % 5 === 0 ? '#d9453b' : i % 3 === 0 ? '#f0e8dc' : '#6b5f52'}
            transparent
            opacity={i % 5 === 0 ? 1 : 0.6}
          />
        </mesh>
      ))}

      {/* Connection lines */}
      {connections.map((line, i) => {
        const geometry = new THREE.BufferGeometry().setFromPoints(
          line.map((p) => new THREE.Vector3(...p))
        );
        return (
          <lineSegments key={`line-${i}`} geometry={geometry}>
            <lineBasicMaterial color="#3a322a" transparent opacity={0.3} />
          </lineSegments>
        );
      })}

      {/* Outer glow ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.1, 2.15, 64]} />
        <meshBasicMaterial color="#d9453b" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

const badgeVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1 } },
};

const titleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.3, staggerChildren: 0.1 },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const subtitleVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.7 } },
};

const ctaVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.9 } },
};

export function GlobeHero() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ background: '#1c1915', minHeight: '90vh' }}
    >
      {/* Background gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 50% 60% at 50% 50%, rgba(217,69,59,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Globe canvas - positioned right side on desktop */}
      <div className="absolute inset-0 md:left-[40%] md:w-[60%] opacity-40 md:opacity-60">
        <Canvas
          camera={{ position: [0, 0, 5.5], fov: 45 }}
          style={{ background: 'transparent' }}
          gl={{ alpha: true, antialias: true }}
        >
          <ambientLight intensity={0.5} />
          <GlobeDots />
        </Canvas>
      </div>

      {/* Content overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="max-w-2xl">
          {/* Badge pill */}
          <motion.div
            variants={badgeVariants}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-6"
            style={{
              border: '1px solid #3a322a',
              borderRadius: '999px',
              background: 'rgba(36,31,26,0.8)',
              backdropFilter: 'blur(8px)',
            }}
          >
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

          {/* Headline */}
          <motion.h1
            variants={titleVariants}
            initial="hidden"
            animate="visible"
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-6"
            style={{
              fontFamily: "'Instrument Serif', serif",
              color: '#f0e8dc',
              letterSpacing: '-2px',
            }}
          >
            {['Create.',            'Design.',
              'Ship.',
            ].map((word, i) => (
              <motion.span key={i} variants={wordVariants} className="inline-block mr-3">
                {word === 'Ship.' ? (
                  <span style={{ color: '#d9453b' }}>{word}</span>
                ) : (
                  word
                )}
              </motion.span>
            ))}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={subtitleVariants}
            initial="hidden"
            animate="visible"
            className="text-base md:text-lg max-w-lg mb-10 leading-relaxed"
            style={{ color: '#a09484', fontFamily: "'DM Sans', sans-serif" }}
          >
            Brand identity, pixel art, and content scripts — all in one canvas.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={ctaVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap gap-4"
          >
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-bold tracking-wider transition-all"
              style={{
                background: '#d9453b',
                color: '#fff',
                borderRadius: '4px',
                fontFamily: "'Space Grotesk', monospace",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#b8382f';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(217,69,59,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#d9453b';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Start Creating
              <svg
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
              className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-bold tracking-wider transition-all"
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
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#3a322a';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              View Demo
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, #1c1915, transparent)',
        }}
      />
    </section>
  );
}
