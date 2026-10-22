import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, RoundedBox } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useSpring, animated } from '@react-spring/three';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useBirthday } from '../context/BirthdayContext';

// Lid animation
function GiftBox({ opened, onOpen }) {
  const { theme } = useBirthday();
  const ref = useRef();

  const { lidRotation, lidY, scaleUp } = useSpring({
    lidRotation: opened ? -Math.PI * 0.9 : 0,
    lidY: opened ? 1.2 : 0,
    scaleUp: opened ? 1.15 : 1,
    config: { mass: 1, tension: 120, friction: 20 },
  });

  useFrame((_, d) => {
    if (ref.current && !opened) ref.current.rotation.y += d * 0.3;
  });

  const boxColor = theme.primary;
  const ribbonColor = theme.secondary;
  const lidColor = theme.accent;

  return (
    <animated.group ref={ref} scale={scaleUp}>
      {/* Box body */}
      <RoundedBox args={[1.4, 1.0, 1.4]} radius={0.04} position={[0, 0, 0]}>
        <meshStandardMaterial color={boxColor} roughness={0.3} metalness={0.2} />
      </RoundedBox>

      {/* Ribbon X */}
      <mesh position={[0, 0.51, 0]}>
        <boxGeometry args={[1.42, 0.08, 0.12]} />
        <meshStandardMaterial color={ribbonColor} roughness={0.3} emissive={ribbonColor} emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, 0.51, 0]}>
        <boxGeometry args={[0.12, 0.08, 1.42]} />
        <meshStandardMaterial color={ribbonColor} roughness={0.3} emissive={ribbonColor} emissiveIntensity={0.3} />
      </mesh>

      {/* Ribbon sides */}
      <mesh position={[0, 0, 0.71]}>
        <boxGeometry args={[0.12, 1.02, 0.04]} />
        <meshStandardMaterial color={ribbonColor} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, -0.71]}>
        <boxGeometry args={[0.12, 1.02, 0.04]} />
        <meshStandardMaterial color={ribbonColor} roughness={0.3} />
      </mesh>

      {/* Bow */}
      <mesh position={[-0.15, 0.62, 0]} rotation={[0, 0, -0.4]}>
        <torusGeometry args={[0.2, 0.05, 8, 12, Math.PI]} />
        <meshStandardMaterial color={ribbonColor} emissive={ribbonColor} emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.15, 0.62, 0]} rotation={[0, 0, 0.4]}>
        <torusGeometry args={[0.2, 0.05, 8, 12, Math.PI]} />
        <meshStandardMaterial color={ribbonColor} emissive={ribbonColor} emissiveIntensity={0.5} />
      </mesh>

      {/* Lid */}
      <animated.group
        position-y={lidY}
        rotation-x={lidRotation}
      >
        <RoundedBox args={[1.44, 0.25, 1.44]} radius={0.04} position={[0, 0.37, 0]}>
          <meshStandardMaterial color={lidColor} roughness={0.25} metalness={0.3} />
        </RoundedBox>
      </animated.group>

      {/* Glow when opened */}
      {opened && (
        <>
          <pointLight color={theme.primary} intensity={5} distance={5} />
          <pointLight color={theme.accent} intensity={3} distance={4} position={[0, 1.5, 0]} />
        </>
      )}

      {/* Click target */}
      {!opened && (
        <mesh onClick={onOpen} visible={false}>
          <boxGeometry args={[2, 2, 2]} />
          <meshBasicMaterial />
        </mesh>
      )}
    </animated.group>
  );
}

function GiftScene({ opened, onOpen }) {
  const { theme } = useBirthday();
  return (
    <Canvas camera={{ position: [0, 1.5, 5], fov: 48 }} gl={{ antialias: true, alpha: true }} dpr={[1, 1.5]}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={0.8} />
      <pointLight position={[-3, 2, 2]} intensity={0.5} color={theme.secondary} />

      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.4}>
        <GiftBox opened={opened} onOpen={onOpen} />
      </Float>

      <EffectComposer>
        <Bloom luminanceThreshold={opened ? 0.15 : 0.4} intensity={opened ? 2.5 : 1} />
      </EffectComposer>
    </Canvas>
  );
}

// Burst effect
function LightBurst({ active }) {
  if (!active) return null;
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'radial-gradient(circle, rgba(255,255,200,0.9) 0%, transparent 60%)',
      pointerEvents: 'none',
      animation: 'pulse-glow 0.5s ease-out forwards',
      opacity: 0,
      zIndex: 5,
    }} />
  );
}

export default function GiftSection() {
  const { config, theme } = useBirthday();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [opened, setOpened] = useState(false);
  const [showReveal, setShowReveal] = useState(false);
  const [burst, setBurst] = useState(false);

  const handleOpen = () => {
    setOpened(true);
    setBurst(true);
    setTimeout(() => {
      setBurst(false);
      setShowReveal(true);
    }, 800);
  };

  return (
    <section className="section gift-section" id="gift" ref={ref} style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background orb */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px', height: '600px',
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(${theme.glowRgb}, 0.07) 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}
      >
        <p className="section-eyebrow">🎁 A Surprise Awaits</p>
        <h2 className="section-title">Your Special Gift</h2>
        <p className="section-desc">
          {!opened ? 'Something wonderful is waiting inside. Click the gift to open it!' : '✨ Revealed just for you!'}
        </p>
      </motion.div>

      <motion.div
        className="gift-canvas-area"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1, delay: 0.3 }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <LightBurst active={burst} />
        <GiftScene opened={opened} onOpen={handleOpen} />
      </motion.div>

      {/* Reveal */}
      <AnimatePresence>
        {showReveal && (
          <motion.div
            className="glass-card gift-reveal visible"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            style={{ position: 'relative', zIndex: 1 }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌟</div>
            <p className="gift-message" style={{ color: theme.text }}>
              {config.giftContent}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {!opened && inView && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1 }}
          style={{
            fontFamily: '"Outfit", sans-serif',
            fontSize: '0.85rem',
            color: theme.textMuted,
            letterSpacing: '0.1em',
            animation: 'pulse-glow 2s ease-in-out infinite',
            zIndex: 1,
            position: 'relative',
          }}
        >
          👆 Click the gift box to open it
        </motion.p>
      )}
    </section>
  );
}
