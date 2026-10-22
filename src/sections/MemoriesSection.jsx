import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, RoundedBox, Edges } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useBirthday } from '../context/BirthdayContext';

// Placeholder photo colors (when no real photo uploaded)
const PLACEHOLDER_COLORS = [
  '#1a1035', '#0d2040', '#1a2010', '#201008', '#18101a',
];

// 3D floating photo frame
function PhotoFrame({ photo, index, active, total, onClick }) {
  const ref = useRef();
  const t = useRef(index * ((Math.PI * 2) / total));

  useFrame((state, delta) => {
    if (ref.current) {
      t.current += delta * 0.25;
      const radius = 2.5;
      const x = Math.sin(t.current) * radius;
      const z = Math.cos(t.current) * radius;
      const y = Math.sin(t.current * 0.7 + index) * 0.3;

      if (!active) {
        ref.current.position.x += (x - ref.current.position.x) * 0.04;
        ref.current.position.y += (y - ref.current.position.y) * 0.04;
        ref.current.position.z += (z - ref.current.position.z) * 0.04;
        ref.current.rotation.y += delta * 0.3;
      } else {
        ref.current.position.x += (0 - ref.current.position.x) * 0.08;
        ref.current.position.y += (0 - ref.current.position.y) * 0.08;
        ref.current.position.z += (3 - ref.current.position.z) * 0.08;
        ref.current.rotation.y += (0 - ref.current.rotation.y) * 0.1;
      }
    }
  });

  const color = PLACEHOLDER_COLORS[index % PLACEHOLDER_COLORS.length];

  return (
    <group ref={ref} onClick={onClick} style={{ cursor: 'pointer' }}>
      {/* Frame border */}
      <RoundedBox args={[1.5, 1.1, 0.05]} radius={0.05} smoothness={4}>
        <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.5} />
      </RoundedBox>

      {/* Photo face */}
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[1.35, 0.95]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>

      {/* Photo icon overlay (emoji in 3D space) */}
      <mesh position={[0, 0, 0.04]}>
        <planeGeometry args={[0.4, 0.4]} />
        <meshBasicMaterial color="white" transparent opacity={0.15} />
      </mesh>

      {/* Glow when active */}
      {active && (
        <pointLight color="#FFD700" intensity={2} distance={3} />
      )}
    </group>
  );
}

function MemoryGallery3D({ activeIdx, setActiveIdx, photos }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />

      {photos.map((photo, i) => (
        <Float key={i} speed={1.2} rotationIntensity={0.15} floatIntensity={0.3}>
          <PhotoFrame
            photo={photo}
            index={i}
            total={photos.length}
            active={activeIdx === i}
            onClick={() => setActiveIdx(activeIdx === i ? null : i)}
          />
        </Float>
      ))}

      <EffectComposer>
        <Bloom luminanceThreshold={0.5} intensity={0.8} />
      </EffectComposer>
    </Canvas>
  );
}

export default function MemoriesSection() {
  const { config, theme } = useBirthday();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [activeIdx, setActiveIdx] = useState(null);

  const photos = config.photos || [];
  const activePhoto = activeIdx !== null ? photos[activeIdx] : null;

  return (
    <section className="section memories-section" id="memories" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center' }}
      >
        <p className="section-eyebrow">📸 Through the Years</p>
        <h2 className="section-title">Precious Memories</h2>
        <p className="section-desc">
          Every photo holds a story, a feeling, a moment frozen in time.
          Click a photo to bring it forward.
        </p>
      </motion.div>

      <motion.div
        className="memories-canvas-area"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1, delay: 0.3 }}
        style={{ width: '100%', maxWidth: '900px' }}
      >
        <MemoryGallery3D
          activeIdx={activeIdx}
          setActiveIdx={setActiveIdx}
          photos={photos}
        />
      </motion.div>

      {/* Caption */}
      <AnimatePresence mode="wait">
        {activePhoto ? (
          <motion.div
            key={activeIdx}
            className="photo-caption glass-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <div className="photo-caption-title">{activePhoto.caption}</div>
            <div className="photo-caption-date">{activePhoto.date}</div>
            <button
              className="btn-ghost"
              style={{ marginTop: '0.8rem', fontSize: '0.8rem' }}
              onClick={() => setActiveIdx(null)}
            >
              ← Back to Gallery
            </button>
          </motion.div>
        ) : (
          <motion.p
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            style={{ fontFamily: '"Outfit", sans-serif', fontSize: '0.85rem', color: theme.textMuted, letterSpacing: '0.1em' }}
          >
            Click any photo to view it
          </motion.p>
        )}
      </AnimatePresence>
    </section>
  );
}
