'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motion } from 'framer-motion';

function GlobeParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const radius = 1.8;
  const count = 600;

  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phi = Math.PI * (Math.sqrt(5) - 1);
    const baseColor = new THREE.Color('#d9453b');
    const dimColor = new THREE.Color('#6b3a35');

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      positions[i * 3] = Math.cos(theta) * radiusAtY * radius;
      positions[i * 3 + 1] = y * radius;
      positions[i * 3 + 2] = Math.sin(theta) * radiusAtY * radius;

      const normalizedY = Math.abs(y);
      const color = normalizedY < 0.6 ? baseColor : dimColor;
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = normalizedY < 0.4 ? 0.08 : 0.05;
    }

    return { positions, colors, sizes };
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();
    pointsRef.current.rotation.y = t * 0.12;
    pointsRef.current.rotation.x = Math.sin(t * 0.08) * 0.15;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function GlowRing() {
  const ringRef = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ringRef.current || !ring2Ref.current) return;
    const t = clock.getElapsedTime();
    ringRef.current.rotation.x = Math.PI / 2;
    ringRef.current.rotation.z = t * 0.05;
    ring2Ref.current.rotation.x = Math.PI / 3;
    ring2Ref.current.rotation.z = -t * 0.03;
  });

  return (
    <>
      <mesh ref={ringRef}>
        <torusGeometry args={[2.2, 0.015, 16, 100]} />
        <meshBasicMaterial color="#d9453b" transparent opacity={0.15} />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[2.4, 0.01, 16, 100]} />
        <meshBasicMaterial color="#d9453b" transparent opacity={0.08} />
      </mesh>
    </>
  );
}

function InnerGlow() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const scale = 1 + Math.sin(t * 1.5) * 0.03;
    meshRef.current.scale.setScalar(scale);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.6, 32, 32]} />
      <meshBasicMaterial
        color="#d9453b"
        transparent
        opacity={0.04}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

function ConnectionLines() {
  const linesRef = useRef<THREE.LineSegments>(null);
  const radius = 1.8;
  const lineCount = 80;

  const geometry = useMemo(() => {
    const positions = new Float32Array(lineCount * 6);
    const phi = Math.PI * (Math.sqrt(5) - 1);
    const pts: THREE.Vector3[] = [];

    for (let i = 0; i < lineCount * 2; i++) {
      const y = 1 - (i / (lineCount * 2 - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = phi * i;
      pts.push(new THREE.Vector3(
        Math.cos(theta) * r * radius,
        y * radius,
        Math.sin(theta) * r * radius
      ));
    }

    for (let i = 0; i < lineCount; i++) {
      const a = pts[i * 2];
      const b = pts[i * 2 + 1];
      positions[i * 6] = a.x;
      positions[i * 6 + 1] = a.y;
      positions[i * 6 + 2] = a.z;
      positions[i * 6 + 3] = b.x;
      positions[i * 6 + 4] = b.y;
      positions[i * 6 + 5] = b.z;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (!linesRef.current) return;
    const t = clock.getElapsedTime();
    linesRef.current.rotation.y = t * 0.12;
    linesRef.current.rotation.x = Math.sin(t * 0.08) * 0.15;
  });

  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial color="#d9453b" transparent opacity={0.08} />
    </lineSegments>
  );
}

export function GlobeHero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: '#1c1915' }}>
      {/* Animated gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 70% 50%, rgba(217,69,59,0.08) 0%, transparent 60%), radial-gradient(ellipse at 30% 50%, rgba(240,232,220,0.03) 0%, transparent 50%)',
        }}
      />

      {/* Dot grid overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at center, #3a322a 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* 3D Globe */}
      <div className="absolute right-0 top-0 w-full h-full lg:w-1/2" style={{ zIndex: 1 }}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{ alpha: true, antialias: true }}
          style={{ background: 'transparent' }}
        >
          <GlobeParticles />
          <GlowRing />
          <InnerGlow />
          <ConnectionLines />
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-20 lg:ml-20 xl:ml-32">
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
              background: 'rgba(217,69,59,0.1)',
              border: '1px solid rgba(217,69,59,0.2)',
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#d9453b', animation: 'pulse 2s infinite' }} />
            <span className="text-xs font-bold tracking-wider" style={{ color: '#d9453b', fontFamily: "'Space Grotesk', monospace" }}>
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
              style={{ fontFamily: "'Instrument Serif', serif", color: '#f0e8dc' }}
            >
              Create.{' '}
              <span style={{ color: '#a09484' }}>Design.</span>{' '}
              <span style={{ color: '#d9453b' }}>Ship.</span>
            </motion.h1>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-lg md:text-xl max-w-lg"
            style={{ color: '#a09484', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.7 }}
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
                background: '#d9453b',
                color: '#fff',
                fontFamily: "'Space Grotesk', monospace",
                boxShadow: '0 4px 20px rgba(217,69,59,0.3)',
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
                border: '1px solid #3a322a',
                color: '#a09484',
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
