'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';
import Link from 'next/link';
import * as THREE from 'three';

// Generate brain-like point cloud
function generateBrainPoints(): [number, number, number][] {
  const points: [number, number, number][] = [];

  // Left hemisphere
  for (let i = 0; i < 55; i++) {
    const phi = Math.random() * Math.PI;
    const theta = Math.random() * Math.PI * 2; // only left side
    const r = 1.2 * (0.6 + Math.random() * 0.4);
    const x = -0.5 + r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.cos(phi) * 0.9;
    const z = r * Math.sin(phi) * Math.sin(theta) * 0.8;
    if (x < 0.15) points.push([x, y, z]);
  }

  // Right hemisphere
  for (let i = 0; i < 55; i++) {
    const phi = Math.random() * Math.PI;
    const theta = Math.random() * Math.PI * 2;
    const r = 1.2 * (0.6 + Math.random() * 0.4);
    const x = 0.5 + r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.cos(phi) * 0.9;
    const z = r * Math.sin(phi) * Math.sin(theta) * 0.8;
    if (x > -0.15) points.push([x, y, z]);
  }

  // Brain stem (cylinder going down)
  for (let i = 0; i < 20; i++) {
    const t = i / 20;
    const angle = Math.random() * Math.PI * 2;
    const r = 0.25 * (1 - t * 0.5);
    points.push([
      Math.cos(angle) * r,
      -1.0 - t * 0.8,
      Math.sin(angle) * r,
    ]);
  }

  // Cerebellum (small sphere at back-bottom)
  for (let i = 0; i < 30; i++) {
    const phi = Math.random() * Math.PI;
    const theta = Math.random() * Math.PI * 2;
    const r = 0.5 * (0.6 + Math.random() * 0.4);
    points.push([
      Math.cos(theta) * Math.sin(phi) * r,
      -0.7 + r * Math.cos(phi) * 0.6,
      -0.8 + Math.sin(theta) * Math.sin(phi) * r,
    ]);
  }

  return points;
}

// Generate connections between nearby points
function generateConnections(
  points: [number, number, number][],
  maxDist: number
) {
  const connections: { a: number; b: number; dist: number }[] = [];
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const dx = points[i][0] - points[j][0];
      const dy = points[i][1] - points[j][1];
      const dz = points[i][2] - points[j][2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist < maxDist) {
        connections.push({ a: i, b: j, dist });
      }
    }
  }
  return connections;
}

function NeuralBrain() {
  const groupRef = useRef<THREE.Group>(null);
  const lineMatRefs = useRef<THREE.LineBasicMaterial[]>([]);
  const thoughtParticlesRef = useRef<THREE.Mesh[]>([]);
  const timeRef = useRef(0);

  const brainPoints = useMemo(() => generateBrainPoints(), []);
  const connections = useMemo(
    () => generateConnections(brainPoints, 0.6),
    [brainPoints]
  );

  // Pick some "active" connections for pulsing
  const activeIndices = useMemo(() => {
    const indices: number[] = [];
    for (let i = 0; i < Math.min(15, connections.length); i++) {
      indices.push(Math.floor(Math.random() * connections.length));
    }
    return indices;
  }, [connections]);

  // Pick connections for thought particles
  const thoughtPaths = useMemo(() => {
    const paths: number[] = [];
    for (let i = 0; i < 5; i++) {
      paths.push(Math.floor(Math.random() * connections.length));
    }
    return paths;
  }, [connections]);

  // Build wireframe geometry for all connections
  const connectionGeometry = useMemo(() => {
    const positions = new Float32Array(connections.length * 6);
    const colors = new Float32Array(connections.length * 6);
    const color = new THREE.Color('#d9453b');

    connections.forEach(({ a, b, dist }, i) => {
      const pa = brainPoints[a];
      const pb = brainPoints[b];
      positions[i * 6 + 0] = pa[0];
      positions[i * 6 + 1] = pa[1];
      positions[i * 6 + 2] = pa[2];
      positions[i * 6 + 3] = pb[0];
      positions[i * 6 + 4] = pb[1];
      positions[i * 6 + 5] = pb[2];

      // Closer = brighter
      const brightness = 1 - dist / 0.6;
      const alpha = 0.1 + brightness * 0.2;
      colors[i * 6 + 0] = color.r * alpha;
      colors[i * 6 + 1] = color.g * alpha;
      colors[i * 6 + 2] = color.b * alpha;
      colors[i * 6 + 3] = color.r * alpha;
      colors[i * 6 + 4] = color.g * alpha;
      colors[i * 6 + 5] = color.b * alpha;
    });

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [connections, brainPoints]);

  // Active connection lines (separate geometry for pulsing)
  const activeGeometry = useMemo(() => {
    const geos: THREE.BufferGeometry[] = [];
    activeIndices.forEach((idx) => {
      const { a, b } = connections[idx];
      const pa = brainPoints[a];
      const pb = brainPoints[b];
      const positions = new Float32Array([...pa, ...pb]);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geos.push(geo);
    });
    return geos;
  }, [activeIndices, connections, brainPoints]);

  // Thought particle positions
  const thoughtStarts = useMemo(
    () =>
      thoughtPaths.map((idx) => {
        const { a, b } = connections[idx];
        return { from: brainPoints[a], to: brainPoints[b] };
      }),
    [thoughtPaths, connections, brainPoints]
  );

  useFrame((_, delta) => {
    timeRef.current += delta;
    const t = timeRef.current;

    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.03;
      groupRef.current.rotation.x = Math.sin(t * 0.15) * 0.08;
    }

    // Pulse active lines
    lineMatRefs.current.forEach((mat, i) => {
      if (mat) {
        const phase = t * 2 + i * 1.3;
        mat.opacity = 0.15 + Math.sin(phase) * 0.4 + 0.4;
      }
    });

    // Animate thought particles along paths
    thoughtParticlesRef.current.forEach((mesh, i) => {
      if (mesh && thoughtStarts[i]) {
        const { from, to } = thoughtStarts[i];
        const progress = ((t * 0.5 + i * 0.7) % 2) / 2;
        mesh.position.set(
          from[0] + (to[0] - from[0]) * progress,
          from[1] + (to[1] - from[1]) * progress,
          from[2] + (to[2] - from[2]) * progress
        );
        // Pulse size
        const scale = 0.8 + Math.sin(t * 4 + i) * 0.3;
        mesh.scale.setScalar(scale);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {/* Neural connection lines */}
      <lineSegments geometry={connectionGeometry}>
        <lineBasicMaterial vertexColors transparent opacity={0.8} />
      </lineSegments>

      {/* Active pulsing connections */}
      {activeGeometry.map((geo, i) => (
        <lineSegments key={`active-${i}`} geometry={geo}>
          <lineBasicMaterial
            ref={(el) => {
              if (el) lineMatRefs.current[i] = el;
            }}
            color="#d9453b"
            transparent
            opacity={0.5}
          />
        </lineSegments>
      ))}

      {/* Brain nodes (neurons) */}
      {brainPoints.map((pos, i) => (
        <mesh key={`node-${i}`} position={pos}>
          <sphereGeometry args={[0.02, 6, 6]} />
          <meshBasicMaterial color="#d9453b" />
        </mesh>
      ))}

      {/* Thought particles traveling along connections */}
      {thoughtStarts.map((_, i) => (
        <mesh key={`thought-${i}`} ref={(el) => {
          if (el) thoughtParticlesRef.current[i] = el;
        }}>
          <sphereGeometry args={[0.035, 6, 6]} />
          <meshBasicMaterial color="#d9453b" transparent opacity={0.9} />
        </mesh>
      ))}

      {/* Glow effect */}
      <mesh>
        <sphereGeometry args={[1.8, 32, 32]} />
        <meshBasicMaterial
          color="#d9453b"
          transparent
          opacity={0.015}
          side={THREE.BackSide}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.4, 32, 32]} />
        <meshBasicMaterial
          color="#d9453b"
          transparent
          opacity={0.025}
          side={THREE.BackSide}
        />
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

      {/* Neural brain canvas */}
      <div className="absolute inset-0 md:left-[40%] md:w-[60%] opacity-40 md:opacity-60">
        <Canvas
          role="img"
          aria-label="Decorative AI neural brain animation"
          camera={{ position: [0, 0, 5.5], fov: 45 }}
          style={{ background: 'transparent' }}
          gl={{ alpha: true, antialias: true }}
        >
          <ambientLight intensity={0.5} />
          <NeuralBrain />
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
            {['Create.', 'Design.', 'Ship.'].map((word, i) => (
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
