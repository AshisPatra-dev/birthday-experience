import { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sparkles, Stars, Text3D, Center } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useBirthday } from '../context/BirthdayContext';
import { motion } from 'framer-motion';

// ── Candle flame ──
function CandleFlame({ position, color, lit = true, onClick }) {
  const meshRef = useRef();
  const lightRef = useRef();
  const t = useRef(Math.random() * Math.PI * 2);

  useFrame((_, delta) => {
    t.current += delta * 3;
    if (meshRef.current && lit) {
      meshRef.current.scale.x = 1 + Math.sin(t.current * 2.3) * 0.12;
      meshRef.current.scale.y = 1 + Math.sin(t.current * 1.7) * 0.08;
      meshRef.current.rotation.y = Math.sin(t.current * 0.8) * 0.15;
    }
    if (lightRef.current && lit) {
      lightRef.current.intensity = 1.5 + Math.sin(t.current * 4) * 0.3;
    }
  });

  if (!lit) return null;

  return (
    <group position={position} onClick={onClick}>
      {/* Candle wick */}
      <mesh position={[0, -0.08, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.1, 6]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      {/* Flame core */}
      <mesh ref={meshRef} position={[0, 0.06, 0]}>
        <coneGeometry args={[0.06, 0.22, 8]} />
        <meshStandardMaterial
          color={color || '#FFF3A0'}
          emissive={color || '#FFD700'}
          emissiveIntensity={3}
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* Flame outer glow */}
      <mesh position={[0, 0.03, 0]}>
        <coneGeometry args={[0.1, 0.3, 8]} />
        <meshStandardMaterial
          color="#FF8C00"
          emissive="#FF4500"
          emissiveIntensity={1.5}
          transparent
          opacity={0.3}
        />
      </mesh>
      {/* Point light */}
      <pointLight
        ref={lightRef}
        color={color || '#FFA500'}
        intensity={1.8}
        distance={3}
        decay={2}
      />
    </group>
  );
}

// ── Candle ──
function Candle({ position, color, lit, onBlow }) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.05, 0.05, 0.35, 12]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
      </mesh>
      <CandleFlame
        position={[0, 0.25, 0]}
        color="#FFD580"
        lit={lit}
        onClick={onBlow}
      />
    </group>
  );
}

// ── Birthday Cake ──
function BirthdayCake({ onCandleBlow }) {
  const { theme, candlesLit, setCandlesLit, config } = useBirthday();
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  const candlePositions = [
    [0, 0, 0],
    [0.28, 0, 0.28], [-0.28, 0, 0.28],
    [0.28, 0, -0.28], [-0.28, 0, -0.28],
  ];

  const [litCandles, setLitCandles] = useState([true, true, true, true, true]);

  const blowCandle = (idx) => {
    const next = [...litCandles];
    next[idx] = false;
    setLitCandles(next);
    const remaining = next.filter(Boolean).length;
    setCandlesLit(remaining);
    if (remaining === 0 && onCandleBlow) onCandleBlow();
  };

  const cakeColors = theme.cakeColors || ['#c8860a', '#f5c842', '#e0a800'];

  return (
    <group
      ref={groupRef}
      position={[0, -0.5, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Plate */}
      <mesh position={[0, -0.72, 0]}>
        <cylinderGeometry args={[0.95, 0.95, 0.06, 32]} />
        <meshStandardMaterial color="#e8e8e8" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Bottom layer */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.85, 0.85, 0.4, 32]} />
        <meshStandardMaterial color={cakeColors[0]} roughness={0.7} />
      </mesh>
      {/* Bottom frosting ring */}
      <mesh position={[0, -0.3, 0]}>
        <torusGeometry args={[0.85, 0.04, 8, 32]} />
        <meshStandardMaterial color="#fff" roughness={0.5} />
      </mesh>

      {/* Middle layer */}
      <mesh position={[0, -0.08, 0]}>
        <cylinderGeometry args={[0.68, 0.68, 0.35, 32]} />
        <meshStandardMaterial color={cakeColors[1]} roughness={0.65} />
      </mesh>
      <mesh position={[0, 0.09, 0]}>
        <torusGeometry args={[0.68, 0.04, 8, 32]} />
        <meshStandardMaterial color="#fff" roughness={0.5} />
      </mesh>

      {/* Top layer */}
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.3, 32]} />
        <meshStandardMaterial color={cakeColors[2]} roughness={0.6} />
      </mesh>
      {/* Top frosting */}
      <mesh position={[0, 0.44, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.08, 32]} />
        <meshStandardMaterial color="#fff" roughness={0.4} />
      </mesh>

      {/* Candles */}
      {candlePositions.map((pos, i) => (
        <Candle
          key={i}
          position={[pos[0], 0.55, pos[2]]}
          color={theme.balloonColors?.[i % 4] || '#FF6B9D'}
          lit={litCandles[i]}
          onBlow={() => blowCandle(i)}
        />
      ))}

      {/* Decorative drips */}
      {[0, 72, 144, 216, 288].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <mesh key={i} position={[Math.sin(rad) * 0.5, 0.4, Math.cos(rad) * 0.5]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color="#fff" roughness={0.3} />
          </mesh>
        );
      })}
    </group>
  );
}

// ── Floating Balloons ──
function Balloon({ position, color, speed = 1 }) {
  const ref = useRef();
  const t = useRef(Math.random() * Math.PI * 2);

  useFrame((_, delta) => {
    t.current += delta * speed * 0.5;
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(t.current) * 0.3;
      ref.current.rotation.z = Math.sin(t.current * 0.7) * 0.08;
    }
  });

  return (
    <group ref={ref} position={position}>
      {/* Balloon body */}
      <mesh>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshStandardMaterial
          color={color}
          roughness={0.1}
          metalness={0.0}
          transparent
          opacity={0.92}
          envMapIntensity={1}
        />
      </mesh>
      {/* Highlight */}
      <mesh position={[-0.06, 0.08, 0.16]}>
        <sphereGeometry args={[0.055, 8, 8]} />
        <meshStandardMaterial color="white" transparent opacity={0.5} roughness={0} />
      </mesh>
      {/* Knot */}
      <mesh position={[0, -0.25, 0]}>
        <sphereGeometry args={[0.025, 6, 6]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* String */}
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.7, 4]} />
        <meshStandardMaterial color={color} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

// ── Floating particles ──
function FloatingParticles({ count = 80, color }) {
  const points = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (points.current) {
      points.current.rotation.y += delta * 0.03;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.04}
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

// ── Camera rig that follows mouse ──
function CameraRig({ started }) {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  useFrame((_, delta) => {
    target.current.x += (mouse.current.x * 0.6 - target.current.x) * 0.05;
    target.current.y += (mouse.current.y * 0.3 - target.current.y) * 0.05;
    camera.position.x = target.current.x;
    camera.position.y = target.current.y + 0.5;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ── Hero 3D Scene ──
export function HeroScene({ onCandleBlow }) {
  const { theme, config } = useBirthday();

  return (
    <Canvas
      camera={{ position: [0, 1.5, 5], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <color attach="background" args={['transparent']} />

      {/* Lighting */}
      <ambientLight intensity={0.3} color="#ffffff" />
      <directionalLight position={[5, 8, 5]} intensity={0.8} color="#ffffff" castShadow />
      <pointLight position={[-4, 2, -2]} intensity={0.5} color={theme.primary} />
      <pointLight position={[4, 2, -2]} intensity={0.5} color={theme.secondary} />

      {/* Stars */}
      <Stars radius={80} depth={50} count={3000} factor={3} fade speed={0.5} />

      {/* Cake */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <BirthdayCake onCandleBlow={onCandleBlow} />
      </Float>

      {/* Balloons */}
      {theme.balloonColors?.slice(0, 4).map((color, i) => (
        <Balloon
          key={i}
          position={[
            (i % 2 === 0 ? -1 : 1) * (1.8 + i * 0.4),
            0.5 + (i * 0.5),
            -1 - i * 0.3,
          ]}
          color={color}
          speed={0.8 + i * 0.2}
        />
      ))}

      {/* Sparkles */}
      <Sparkles
        count={60}
        scale={8}
        size={2}
        speed={0.4}
        color={theme.primary}
        opacity={0.6}
      />

      {/* Ambient particles */}
      <FloatingParticles count={60} color={theme.primary} />

      {/* Camera movement */}
      <CameraRig />

      {/* Post processing */}
      <EffectComposer>
        <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.9} intensity={1.2} />
        <Vignette eskil={false} offset={0.3} darkness={0.7} />
      </EffectComposer>
    </Canvas>
  );
}

// ── Hero Section ──
export default function HeroSection({ onStart }) {
  const { config, theme } = useBirthday();
  const [candlesBlown, setCandlesBlown] = useState(false);

  return (
    <section className="hero-section" id="hero">
      {/* 3D Canvas background */}
      <div className="hero-canvas">
        <HeroScene onCandleBlow={() => setCandlesBlown(true)} />
      </div>

      {/* Overlay content */}
      <div className="hero-content">
        <motion.div
          className="hero-label"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{ fontFamily: '"Dancing Script", cursive', color: theme.primary, opacity: 1 }}
        >
          ✨ A Special Celebration ✨
        </motion.div>

        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 2.4, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          Happy Birthday,
          <span className="hero-name" style={{ color: theme.primary }}>{config.name}!</span>
        </motion.h1>

        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.0, duration: 1, ease: 'easeOut' }}
        >
          Today is all about you — your laughter, your magic, your light.
          <br />Let the celebration begin! 🎉
        </motion.p>

        <motion.div
          className="hero-cta"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.5, duration: 1, ease: 'easeOut' }}
        >
          <button className="btn-primary" onClick={onStart}>
            <span>🎁 Start the Birthday Experience</span>
          </button>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          opacity: 0.5,
          zIndex: 2,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 4, duration: 1 }}
      >
        <span style={{ fontFamily: '"Outfit", sans-serif', fontSize: '0.75rem', letterSpacing: '0.2em', color: theme.textMuted }}>SCROLL</span>
        <div style={{
          width: '1px',
          height: '40px',
          background: `linear-gradient(to bottom, ${theme.primary}88, transparent)`,
          animation: 'float 2s ease-in-out infinite',
        }} />
      </motion.div>
    </section>
  );
}
