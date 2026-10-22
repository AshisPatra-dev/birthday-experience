import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { motion, useInView } from 'framer-motion';
import { useBirthday } from '../context/BirthdayContext';

// ── Firework Shell ──
function FireworkShell({ color, origin }) {
  const ref = useRef();
  const particles = useMemo(() => {
    return Array.from({ length: 80 }, () => {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const speed = 0.8 + Math.random() * 1.5;
      return {
        vx: Math.sin(phi) * Math.cos(theta) * speed,
        vy: Math.sin(phi) * Math.sin(theta) * speed,
        vz: Math.cos(phi) * speed,
        life: 1,
      };
    });
  }, []);

  const posArr = useMemo(() => new Float32Array(particles.length * 3), []);
  const t = useRef(0);
  const exploded = useRef(false);

  useFrame((_, delta) => {
    t.current += delta;
    if (t.current < 0.01) return;

    if (!exploded.current) exploded.current = true;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.life -= delta * 0.5;
      if (p.life < 0) p.life = 0;
      posArr[i * 3] = origin[0] + p.vx * t.current * 1.5;
      posArr[i * 3 + 1] = origin[1] + p.vy * t.current * 1.5 - 0.5 * t.current * t.current;
      posArr[i * 3 + 2] = origin[2] + p.vz * t.current * 0.5;
    }

    if (ref.current) {
      ref.current.geometry.attributes.position.needsUpdate = true;
      ref.current.material.opacity = Math.max(0, 1 - t.current * 0.8);
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[posArr, 3]} />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.08} transparent opacity={1} sizeAttenuation />
    </points>
  );
}

// ── Fireworks Manager ──
function FireworksDisplay({ active }) {
  const { theme } = useBirthday();
  const [shells, setShells] = useState([]);
  const counter = useRef(0);

  useEffect(() => {
    if (!active) return;
    const spawn = () => {
      const colors = theme.confettiColors || ['#FFD700', '#FF6B9D', '#00CED1', '#A855F7', '#FF6347'];
      setShells(prev => [
        ...prev.slice(-12),
        {
          id: counter.current++,
          color: colors[Math.floor(Math.random() * colors.length)],
          origin: [
            (Math.random() - 0.5) * 8,
            1 + Math.random() * 3,
            (Math.random() - 0.5) * 4,
          ],
        },
      ]);
    };

    spawn();
    const interval = setInterval(spawn, 600);
    return () => clearInterval(interval);
  }, [active, theme]);

  return (
    <>
      {shells.map(shell => (
        <FireworkShell key={shell.id} color={shell.color} origin={shell.origin} />
      ))}
    </>
  );
}

// ── Floating Confetti 3D ──
function Confetti3D({ count = 120 }) {
  const { theme } = useBirthday();
  const ref = useRef();
  const colors = theme.confettiColors || ['#FFD700', '#FF6B9D', '#00CED1'];

  const { positions, velocities, rotations } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 0.02,
      y: -(0.005 + Math.random() * 0.015),
      rot: (Math.random() - 0.5) * 0.05,
    }));
    const rotations = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = Math.random() * 10 - 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      rotations[i] = Math.random() * Math.PI * 2;
    }

    return { positions, velocities, rotations };
  }, [count]);

  const posRef = useRef(positions);

  useFrame(() => {
    const p = posRef.current;
    for (let i = 0; i < count; i++) {
      p[i * 3] += velocities[i].x;
      p[i * 3 + 1] += velocities[i].y;
      p[i * 3 + 2] += 0;
      if (p[i * 3 + 1] < -6) {
        p[i * 3 + 1] = 6;
        p[i * 3] = (Math.random() - 0.5) * 14;
      }
    }
    if (ref.current) {
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[posRef.current, 3]} />
      </bufferGeometry>
      <pointsMaterial color={colors[0]} size={0.1} transparent opacity={0.85} sizeAttenuation />
    </points>
  );
}

// ── Rising Balloons (CSS) ──
function CSSBalloons({ active }) {
  const { theme } = useBirthday();
  const colors = theme.balloonColors || ['#FFD700', '#FF6B9D', '#00CED1', '#A855F7'];

  if (!active) return null;

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 3 }}>
      {Array.from({ length: 12 }, (_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            bottom: '-80px',
            left: `${5 + (i / 12) * 90}%`,
            fontSize: `${2 + Math.random()}rem`,
            animation: `balloon-rise ${5 + Math.random() * 4}s ease-out ${Math.random() * 2}s forwards`,
            filter: `drop-shadow(0 0 12px ${colors[i % colors.length]}88)`,
          }}
        >
          🎈
        </div>
      ))}
    </div>
  );
}

function CelebrationCanvas({ active }) {
  const { theme } = useBirthday();
  return (
    <Canvas camera={{ position: [0, 1, 8], fov: 55 }} gl={{ antialias: true, alpha: true }} dpr={[1, 1.5]}>
      <ambientLight intensity={0.5} />
      <Stars radius={60} depth={40} count={2000} factor={3} fade speed={0.5} />

      <FireworksDisplay active={active} />
      <Confetti3D count={80} />
      <Sparkles count={60} scale={10} size={3} speed={0.6} color={theme.primary} opacity={0.8} />

      <EffectComposer>
        <Bloom luminanceThreshold={0.1} intensity={2} />
      </EffectComposer>
    </Canvas>
  );
}

export default function CelebrationSection() {
  const { config, theme } = useBirthday();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (inView) setTimeout(() => setActive(true), 500);
  }, [inView]);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section className="section celebration-section" id="celebration" ref={ref}>
      {/* 3D canvas background */}
      <div className="celebration-canvas">
        <CelebrationCanvas active={active} />
      </div>

      {/* Rising balloons */}
      <CSSBalloons active={active} />

      <motion.div
        className="celebration-content"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        {/* Eyebrow */}
        <motion.p variants={itemVariants} className="section-eyebrow" style={{ fontSize: '1rem' }}>
          🎊 The Grand Finale 🎊
        </motion.p>

        {/* Big title */}
        <motion.h2
          variants={itemVariants}
          className="celebration-title"
        >
          Happy Birthday,
          <br />
          <span style={{
            fontStyle: 'italic',
            background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {config.name}!
          </span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p variants={itemVariants} className="celebration-sub">
          {config.finalGreeting?.replace('[NAME]', config.name) || `Here's to you and all the magic you bring! 🌟`}
        </motion.p>

        {/* Closing message */}
        <motion.div
          variants={itemVariants}
          className="glass-card"
          style={{ maxWidth: '600px', textAlign: 'center' }}
        >
          <p style={{
            fontFamily: '"Dancing Script", cursive',
            fontSize: 'clamp(1.3rem, 4vw, 2.2rem)',
            lineHeight: 1.6,
            color: theme.text,
          }}>
            May every dream you have take flight,<br />
            may every day be filled with delight,<br />
            and may this birthday be the start<br />
            of the most beautiful chapter yet. 💕
          </p>
        </motion.div>

        {/* Emoji row */}
        <motion.div
          variants={itemVariants}
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '0.5rem' }}
        >
          🎂🎈🎉🌟🎁
        </motion.div>

        {/* Restart button */}
        <motion.div variants={itemVariants}>
          <button
            className="btn-primary"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <span>🎂 Celebrate Again</span>
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
