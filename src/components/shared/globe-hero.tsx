'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motion } from 'framer-motion';

function fibonacciSphere(count: number, radius: number): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const phi = Math.PI * (Math.sqrt(5) - 1); // golden angle
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = phi * i;
    points.push(new THREE.Vector3(
      Math.cos(theta) * radiusAtY * radius,
      y * radius,
      Math.sin(theta) * radiusAtY * radius
    ));
  }
  return points;
}

function GlobeDots() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const radius = 1.8;
  const count = 200;
  const points = useMemo(() => fibonacciSphere(count, radius), []);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color('#d9453b'), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.y = time * 0.08;
    meshRef.current.rotation.x = Math.sin(time * 0.05) * 0.1;
  });

  useMemo(() => {
    if (!meshRef.current) return;
    points.forEach((point, i) => {
      dummy.position.copy(point);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
      meshRef.current!.setColorAt(i, color);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [points, dummy, color]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.025, 8, 8]} />
      <meshStandardMaterial color="#d9453b" emissive="#d9453b" emissiveIntensity={0.5} />
    </instancedMesh>
  );
}

function GlowRing() {
  const ringRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!ringRef.current) return;
    const time = state.clock.getElapsedTime();
    ringRef.current.rotation.x = Math.PI / 2;
    ringRef.current.rotation.z = time * 0.05;
  });

  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[2.2, 0.02, 16, 100]} />
      <meshStandardMaterial color="#d9453b" transparent opacity={0.15} emissive="#d9453b" emissiveIntensity={0.3} />
    </mesh>
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
          animation: 'gradientShift 15s ease-in-out infinite alternate',
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
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={0.6} color="#d9453b" />
          <GlobeDots />
          <GlowRing />
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
        @keyframes gradientShift {
          0% { opacity: 1; }
          50% { opacity: 0.8; }
          100% { opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.5); }
        }
      `}</style>
    </section>
  );
}
