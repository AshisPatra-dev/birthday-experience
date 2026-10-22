import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useBirthday } from '../context/BirthdayContext';

// Reusable flame
function Flame({ position, lit, onClick, color = '#FFD580' }) {
  const ref = useRef();
  const t = useRef(Math.random() * Math.PI * 2);
  useFrame((_, d) => {
    t.current += d * 3;
    if (ref.current && lit) {
      ref.current.scale.x = 1 + Math.sin(t.current * 2.1) * 0.15;
      ref.current.scale.y = 1 + Math.sin(t.current * 1.8) * 0.1;
    }
  });
  if (!lit) return null;
  return (
    <group position={position} onClick={onClick}>
      <mesh ref={ref} position={[0, 0.08, 0]}>
        <coneGeometry args={[0.07, 0.25, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={4} transparent opacity={0.9} />
      </mesh>
      <pointLight color={color} intensity={2} distance={3} decay={2} />
    </group>
  );
}

// Interactive Cake in Cake Section
function InteractiveCake({ litCandles, onBlow }) {
  const { theme } = useBirthday();
  const groupRef = useRef();

  useFrame((_, d) => {
    if (groupRef.current) groupRef.current.rotation.y += d * 0.1;
  });

  const candles = [
    { pos: [0, 0, 0], color: theme.balloonColors?.[0] || '#FFD700' },
    { pos: [0.3, 0, 0.3], color: theme.balloonColors?.[1] || '#FF6B9D' },
    { pos: [-0.3, 0, 0.3], color: theme.balloonColors?.[2] || '#00CED1' },
    { pos: [0.3, 0, -0.3], color: theme.balloonColors?.[3] || '#A855F7' },
    { pos: [-0.3, 0, -0.3], color: theme.balloonColors?.[0] || '#FFD700' },
  ];

  const cakeColors = theme.cakeColors || ['#c8860a', '#f5c842', '#e0a800'];

  return (
    <group ref={groupRef}>
      {/* Bottom tier */}
      <mesh position={[0, -0.45, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.4, 32]} />
        <meshStandardMaterial color={cakeColors[0]} roughness={0.6} />
      </mesh>
      <mesh position={[0, -0.25, 0]}>
        <torusGeometry args={[0.9, 0.045, 8, 32]} />
        <meshStandardMaterial color="white" roughness={0.4} />
      </mesh>

      {/* Middle tier */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 0.38, 32]} />
        <meshStandardMaterial color={cakeColors[1]} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.14, 0]}>
        <torusGeometry args={[0.7, 0.04, 8, 32]} />
        <meshStandardMaterial color="white" roughness={0.4} />
      </mesh>

      {/* Top tier */}
      <mesh position={[0, 0.33, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.35, 32]} />
        <meshStandardMaterial color={cakeColors[2]} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.52, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.06, 32]} />
        <meshStandardMaterial color="white" roughness={0.35} />
      </mesh>

      {/* Candles */}
      {candles.map((c, i) => (
        <group key={i} position={[c.pos[0], 0.7, c.pos[2]]}>
          <mesh>
            <cylinderGeometry args={[0.055, 0.055, 0.38, 10]} />
            <meshStandardMaterial color={c.color} roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.09, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.1, 6]} />
            <meshStandardMaterial color="#111" />
          </mesh>
          <Flame
            position={[0, 0.27, 0]}
            lit={litCandles[i]}
            onClick={() => onBlow(i)}
            color="#FFD580"
          />
        </group>
      ))}

      {/* Sparkles around lit candles */}
      {litCandles.some(Boolean) && (
        <Sparkles count={30} scale={2.5} size={1.5} speed={0.5} color={theme.primary} />
      )}
    </group>
  );
}

function CakeScene({ litCandles, onBlow }) {
  const { theme } = useBirthday();
  return (
    <Canvas camera={{ position: [0, 1.5, 5], fov: 45 }} gl={{ antialias: true, alpha: true }} dpr={[1, 1.5]}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={0.8} />
      <pointLight position={[-3, 2, 2]} intensity={0.5} color={theme.secondary} />

      <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.3}>
        <InteractiveCake litCandles={litCandles} onBlow={onBlow} />
      </Float>

      <EffectComposer>
        <Bloom luminanceThreshold={0.25} intensity={1.5} />
      </EffectComposer>
    </Canvas>
  );
}

// Confetti burst CSS
function ConfettiBurst({ active }) {
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    color: ['#FFD700', '#FF6B9D', '#00CED1', '#A855F7', '#FF6347', '#FFFFFF'][i % 6],
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 0.5,
    size: 6 + Math.random() * 8,
    rotation: Math.random() * 360,
  }));

  if (!active) return null;

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 10 }}>
      {pieces.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            top: '40%',
            left: p.left,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: '2px',
            transform: `rotate(${p.rotation}deg)`,
            animation: `balloon-rise ${1.5 + Math.random()}s ease-out ${p.delay}s forwards`,
            boxShadow: `0 0 4px ${p.color}`,
          }}
        />
      ))}
    </div>
  );
}

export default function CakeSection({ onAllBlown }) {
  const { config, theme, candlesLit, setCandlesLit } = useBirthday();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [litCandles, setLitCandles] = useState([true, true, true, true, true]);
  const [allBlown, setAllBlown] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const blowCandle = (idx) => {
    const next = [...litCandles];
    next[idx] = false;
    setLitCandles(next);
    const remaining = next.filter(Boolean).length;
    setCandlesLit(remaining);
    if (remaining === 0) {
      setAllBlown(true);
      setShowConfetti(true);
      setTimeout(() => {
        if (onAllBlown) onAllBlown();
      }, 2000);
    }
  };

  const relight = () => {
    setLitCandles([true, true, true, true, true]);
    setCandlesLit(5);
    setAllBlown(false);
    setShowConfetti(false);
  };

  const remaining = litCandles.filter(Boolean).length;

  return (
    <section className="section cake-section" id="cake" ref={ref} style={{ position: 'relative', overflow: 'hidden' }}>
      <ConfettiBurst active={showConfetti} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}
      >
        <p className="section-eyebrow">🎂 Make a Wish</p>
        <h2 className="section-title">Your Birthday Cake</h2>
        <p className="section-desc">
          {allBlown
            ? '🎉 Your wish is on its way! Happy Birthday!'
            : 'Click each candle to blow it out and make a wish!'}
        </p>
      </motion.div>

      <motion.div
        className="cake-canvas-area"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1, delay: 0.3 }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <CakeScene litCandles={litCandles} onBlow={blowCandle} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.6 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', zIndex: 1, position: 'relative' }}
      >
        {!allBlown ? (
          <>
            <div className="candle-counter">
              <span>Candles remaining:</span>
              <span className="candle-counter-num">{remaining}</span>
              <span>🕯️</span>
            </div>
            <p className="cake-instruction">✨ Click on each candle flame to blow it out</p>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}
          >
            <div style={{
              fontFamily: '"Dancing Script", cursive',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              color: theme.primary,
              filter: `drop-shadow(0 0 20px rgba(${theme.glowRgb}, 0.8))`,
              animation: 'pulse-glow 2s ease-in-out infinite',
            }}>
              🌟 Your wish has been made! 🌟
            </div>
            <button className="btn-ghost" onClick={relight}>
              🕯️ Relight Candles
            </button>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
