'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

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

// ─── Brain 3D Component ────────────────────────────────────────────────────────

function fibonacciSphere(count: number, radius: number, center: [number, number, number]): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const phi = (1 + Math.sqrt(5)) / 2; // golden ratio

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2; // y goes from 1 to -1
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = 2 * Math.PI * i / phi;

    const x = Math.cos(theta) * radiusAtY;
    const z = Math.sin(theta) * radiusAtY;

    points.push(new THREE.Vector3(
      x * radius + center[0],
      y * radius + center[1],
      z * radius + center[2]
    ));
  }
  return points;
}

function generateBrainPoints(): THREE.Vector3[] {
  const leftHemisphere = fibonacciSphere(50, 1.0, [-0.4, 0.1, 0]);
  const rightHemisphere = fibonacciSphere(50, 1.0, [0.4, 0.1, 0]);
  const cerebellum = fibonacciSphere(15, 0.5, [0, -0.3, -0.3]);

  // Brain stem - a few points in a cylinder shape
  const brainStem: THREE.Vector3[] = [];
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const r = 0.15;
    brainStem.push(new THREE.Vector3(
      Math.cos(angle) * r,
      -0.5 - (i * 0.08),
      -0.2 + Math.sin(angle) * r * 0.5
    ));
  }

  return [...leftHemisphere, ...rightHemisphere, ...cerebellum, ...brainStem];
}

function generateConnections(points: THREE.Vector3[], maxDist: number, maxConnections: number): [number, number][] {
  const connections: [number, number][] = [];
  const leftPoints: number[] = [];
  const rightPoints: number[] = [];

  // Separate points into hemispheres (roughly)
  points.forEach((p, i) => {
    if (p.x < 0) leftPoints.push(i);
    else rightPoints.push(i);
  });

  // Connect within each hemisphere only
  const hemispheres = [leftPoints, rightPoints];

  for (const hemisphere of hemispheres) {
    for (let i = 0; i < hemisphere.length && connections.length < maxConnections; i++) {
      for (let j = i + 1; j < hemisphere.length && connections.length < maxConnections; j++) {
        const dist = points[hemisphere[i]].distanceTo(points[hemisphere[j]]);
        if (dist < maxDist && Math.random() < 0.3) { // Sparse selection
          connections.push([hemisphere[i], hemisphere[j]]);
        }
      }
    }
  }

  return connections.slice(0, maxConnections);
}

// ─── Neural Firing System ──────────────────────────────────────────────────────

interface FiringEvent {
  connectionIndex: number;
  startTime: number;
  duration: number;
}

interface NodePulse {
  nodeIndex: number;
  startTime: number;
  duration: number;
}

function BrainVisualization() {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const firingDotRef = useRef<THREE.Points>(null);

  const [firingEvents, setFiringEvents] = useState<FiringEvent[]>([]);
  const [nodePulses, setNodePulses] = useState<NodePulse[]>([]);
  const lastFiringTime = useRef(0);
  const lastPulseTime = useRef(0);

  const brainData = useMemo(() => {
    const points = generateBrainPoints();
    const connections = generateConnections(points, 0.4, 80);

    // Create buffer geometries
    const nodePositions = new Float32Array(points.length * 3);
    const nodeColors = new Float32Array(points.length * 3);
    const nodeSizes = new Float32Array(points.length);

    points.forEach((p, i) => {
      nodePositions[i * 3] = p.x;
      nodePositions[i * 3 + 1] = p.y;
      nodePositions[i * 3 + 2] = p.z;
      nodeColors[i * 3] = 0.85; // #d9453b normalized
      nodeColors[i * 3 + 1] = 0.27;
      nodeColors[i * 3 + 2] = 0.23;
      nodeSizes[i] = 0.015;
    });

    // Create line geometries for connections
    const linePositions = new Float32Array(connections.length * 6);
    const lineColors = new Float32Array(connections.length * 6);

    connections.forEach(([a, b], i) => {
      linePositions[i * 6] = points[a].x;
      linePositions[i * 6 + 1] = points[a].y;
      linePositions[i * 6 + 2] = points[a].z;
      linePositions[i * 6 + 3] = points[b].x;
      linePositions[i * 6 + 4] = points[b].y;
      linePositions[i * 6 + 5] = points[b].z;

      // Default line color (dim)
      lineColors[i * 6] = 0.85;
      lineColors[i * 6 + 1] = 0.27;
      lineColors[i * 6 + 2] = 0.23;
      lineColors[i * 6 + 3] = 0.85;
      lineColors[i * 6 + 4] = 0.27;
      lineColors[i * 6 + 5] = 0.23;
    });

    return { points, connections, nodePositions, nodeColors, nodeSizes, linePositions, lineColors };
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // Slow rotation
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.02 * delta;
    }

    // Spawn new firing events
    if (time - lastFiringTime.current > 0.8 + Math.random() * 0.7) {
      if (firingEvents.length < 5) {
        const connectionIndex = Math.floor(Math.random() * brainData.connections.length);
        setFiringEvents(prev => [...prev, {
          connectionIndex,
          startTime: time,
          duration: 0.3 + Math.random() * 0.2
        }]);
        lastFiringTime.current = time;
      }
    }

    // Spawn node pulses
    if (time - lastPulseTime.current > 1.0 + Math.random() * 1.0) {
      if (nodePulses.length < 3) {
        const nodeIndex = Math.floor(Math.random() * brainData.points.length);
        setNodePulses(prev => [...prev, {
          nodeIndex,
          startTime: time,
          duration: 0.5
        }]);
        lastPulseTime.current = time;
      }
    }

    // Clean up expired events
    setFiringEvents(prev => prev.filter(e => time - e.startTime < e.duration));
    setNodePulses(prev => prev.filter(p => time - p.startTime < p.duration));

    // Update node colors and sizes based on pulses
    if (pointsRef.current) {
      const colors = pointsRef.current.geometry.attributes.color.array as Float32Array;
      const sizes = pointsRef.current.geometry.attributes.size.array as Float32Array;

      // Reset all nodes to default
      for (let i = 0; i < brainData.points.length; i++) {
        colors[i * 3] = 0.85;
        colors[i * 3 + 1] = 0.27;
        colors[i * 3 + 2] = 0.23;
        sizes[i] = 0.015;
      }

      // Apply pulses
      nodePulses.forEach(pulse => {
        const progress = (time - pulse.startTime) / pulse.duration;
        const intensity = Math.sin(progress * Math.PI); // Fade in then out

        colors[pulse.nodeIndex * 3] = 1.0; // #ff6b5a
        colors[pulse.nodeIndex * 3 + 1] = 0.42;
        colors[pulse.nodeIndex * 3 + 2] = 0.35;
        sizes[pulse.nodeIndex] = 0.015 + intensity * 0.01;
      });

      pointsRef.current.geometry.attributes.color.needsUpdate = true;
      pointsRef.current.geometry.attributes.size.needsUpdate = true;
    }

    // Update line colors based on firing
    if (linesRef.current) {
      const colors = linesRef.current.geometry.attributes.color.array as Float32Array;

      // Reset all lines to dim
      for (let i = 0; i < brainData.connections.length * 6; i++) {
        colors[i] = 0.85 * 0.15; // Very dim
        if (i % 3 === 1) colors[i] = 0.27 * 0.15;
        if (i % 3 === 2) colors[i] = 0.23 * 0.15;
      }

      // Brighten firing connections
      firingEvents.forEach(event => {
        const progress = (time - event.startTime) / event.duration;
        const brightness = Math.sin(progress * Math.PI) * 0.8;

        const idx = event.connectionIndex * 6;
        colors[idx] = 0.85 * brightness;
        colors[idx + 1] = 0.27 * brightness;
        colors[idx + 2] = 0.23 * brightness;
        colors[idx + 3] = 0.85 * brightness;
        colors[idx + 4] = 0.27 * brightness;
        colors[idx + 5] = 0.23 * brightness;
      });

      linesRef.current.geometry.attributes.color.needsUpdate = true;
    }

    // Update firing dots (moving bright points along connections)
    if (firingDotRef.current && firingEvents.length > 0) {
      const dotPositions = new Float32Array(firingEvents.length * 3);
      const dotColors = new Float32Array(firingEvents.length * 3);

      firingEvents.forEach((event, i) => {
        const [a, b] = brainData.connections[event.connectionIndex];
        const progress = (time - event.startTime) / event.duration;

        // Move from point A to point B
        dotPositions[i * 3] = brainData.points[a].x + (brainData.points[b].x - brainData.points[a].x) * progress;
        dotPositions[i * 3 + 1] = brainData.points[a].y + (brainData.points[b].y - brainData.points[a].y) * progress;
        dotPositions[i * 3 + 2] = brainData.points[a].z + (brainData.points[b].z - brainData.points[a].z) * progress;

        // Bright red
        dotColors[i * 3] = 1.0;
        dotColors[i * 3 + 1] = 0.42;
        dotColors[i * 3 + 2] = 0.35;
      });

      firingDotRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(dotPositions, 3));
      firingDotRef.current.geometry.setAttribute('color', new THREE.BufferAttribute(dotColors, 3));
    }
  });

  return (
    <group ref={groupRef} position={[2, 0, 0]} rotation={[0.26, 0, 0]}>
      {/* Brain glow (subtle ambient sphere) */}
      <mesh>
        <sphereGeometry args={[1.8, 32, 32]} />
        <meshBasicMaterial
          color="#d9453b"
          transparent
          opacity={0.02}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Nodes (instanced points) */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={brainData.nodePositions}
            count={brainData.points.length}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            array={brainData.nodeColors}
            count={brainData.points.length}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            array={brainData.nodeSizes}
            count={brainData.points.length}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.015}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* Connection lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={brainData.linePositions}
            count={brainData.connections.length * 2}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            array={brainData.lineColors}
            count={brainData.connections.length * 2}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.6}
          depthWrite={false}
        />
      </lineSegments>

      {/* Firing dots (bright moving points) */}
      <points ref={firingDotRef}>
        <bufferGeometry />
        <pointsMaterial
          size={0.04}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  );
}

function BrainCanvas() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 5 }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <BrainVisualization />
      </Canvas>
    </div>
  );
}

// ─── Main Hero Component ───────────────────────────────────────────────────────

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

      {/* 3D Brain Visualization */}
      <BrainCanvas />

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
