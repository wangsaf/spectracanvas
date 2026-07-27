'use client';

import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { motion } from 'framer-motion';

function GlobeScene() {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useThree();

  useEffect(() => {
    const group = new THREE.Group();
    const radius = 1.8;
    const dotCount = 500;
    const phi = Math.PI * (Math.sqrt(5) - 1);

    // Create dot geometry
    const dotGeometry = new THREE.BufferGeometry();
    const dotPositions = new Float32Array(dotCount * 3);
    const dotColors = new Float32Array(dotCount * 3);
    const baseColor = new THREE.Color('#d9453b');
    const dimColor = new THREE.Color('#6b3a35');

    for (let i = 0; i < dotCount; i++) {
      const y = 1 - (i / (dotCount - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      dotPositions[i * 3] = Math.cos(theta) * radiusAtY * radius;
      dotPositions[i * 3 + 1] = y * radius;
      dotPositions[i * 3 + 2] = Math.sin(theta) * radiusAtY * radius;

      const normalizedY = Math.abs(y);
      const color = normalizedY < 0.6 ? baseColor : dimColor;
      dotColors[i * 3] = color.r;
      dotColors[i * 3 + 1] = color.g;
      dotColors[i * 3 + 2] = color.b;
    }

    dotGeometry.setAttribute('position', new THREE.BufferAttribute(dotPositions, 3));
    dotGeometry.setAttribute('color', new THREE.BufferAttribute(dotColors, 3));

    const dotMaterial = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const dots = new THREE.Points(dotGeometry, dotMaterial);
    group.add(dots);

    // Create connection lines
    const lineCount = 60;
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(lineCount * 6);

    for (let i = 0; i < lineCount; i++) {
      const y1 = 1 - (i / lineCount) * 2;
      const y2 = 1 - ((i + lineCount) / (lineCount * 2)) * 2;
      const r1 = Math.sqrt(1 - y1 * y1);
      const r2 = Math.sqrt(1 - y2 * y2);
      const theta1 = phi * i;
      const theta2 = phi * (i + lineCount);

      linePositions[i * 6] = Math.cos(theta1) * r1 * radius;
      linePositions[i * 6 + 1] = y1 * radius;
      linePositions[i * 6 + 2] = Math.sin(theta1) * r1 * radius;
      linePositions[i * 6 + 3] = Math.cos(theta2) * r2 * radius;
      linePositions[i * 6 + 4] = y2 * radius;
      linePositions[i * 6 + 5] = Math.sin(theta2) * r2 * radius;
    }

    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lineMaterial = new THREE.LineBasicMaterial({
      color: '#d9453b',
      transparent: true,
      opacity: 0.06,
    });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    group.add(lines);

    // Create orbit rings
    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(2.2, 0.015, 16, 100),
      new THREE.MeshBasicMaterial({ color: '#d9453b', transparent: true, opacity: 0.12 })
    );
    ring1.rotation.x = Math.PI / 2;
    group.add(ring1);

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(2.4, 0.01, 16, 100),
      new THREE.MeshBasicMaterial({ color: '#d9453b', transparent: true, opacity: 0.06 })
    );
    ring2.rotation.x = Math.PI / 3;
    group.add(ring2);

    // Create inner glow sphere
    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(1.6, 32, 32),
      new THREE.MeshBasicMaterial({ color: '#d9453b', transparent: true, opacity: 0.04, side: THREE.BackSide })
    );
    group.add(glow);

    scene.add(group);
    groupRef.current = group;

    return () => {
      scene.remove(group);
      dotGeometry.dispose();
      dotMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      ring1.geometry.dispose();
      (ring1.material as THREE.Material).dispose();
      ring2.geometry.dispose();
      (ring2.material as THREE.Material).dispose();
      glow.geometry.dispose();
      (glow.material as THREE.Material).dispose();
    };
  }, [scene]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.12;
    groupRef.current.rotation.x = Math.sin(t * 0.08) * 0.15;

    // Pulse rings
    const rings = groupRef.current.children.filter(c => c instanceof THREE.Mesh && c.geometry.type === 'TorusGeometry');
    rings.forEach((ring, i) => {
      ring.rotation.z = (i === 1 ? -1 : 1) * t * 0.05;
    });
  });

  return null;
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
          <GlobeScene />
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
