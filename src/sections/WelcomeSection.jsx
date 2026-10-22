import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useBirthday } from '../context/BirthdayContext';

const FloatingBalloon = ({ color, left, delay, duration }) => (
  <div
    style={{
      position: 'absolute',
      left,
      bottom: '-20px',
      animation: `balloon-rise ${duration}s ease-in ${delay}s forwards`,
      fontSize: '3rem',
      filter: `drop-shadow(0 0 15px ${color}88)`,
      zIndex: 0,
      opacity: 0,
    }}
  >
    🎈
  </div>
);

export default function WelcomeSection() {
  const { config, theme } = useBirthday();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [showBalloons, setShowBalloons] = useState(false);

  useEffect(() => {
    if (inView) {
      setTimeout(() => setShowBalloons(true), 800);
    }
  }, [inView]);

  const balloons = [
    { color: theme.balloonColors?.[0] || '#FFD700', left: '10%', delay: 0.2, duration: 6 },
    { color: theme.balloonColors?.[1] || '#FF6B9D', left: '25%', delay: 0.5, duration: 7 },
    { color: theme.balloonColors?.[2] || '#00CED1', left: '65%', delay: 0.1, duration: 5.5 },
    { color: theme.balloonColors?.[3] || '#A855F7', left: '80%', delay: 0.7, duration: 6.5 },
    { color: theme.balloonColors?.[0] || '#FFD700', left: '45%', delay: 1.0, duration: 7.5 },
  ];

  const stats = [
    { label: 'Years of Joy', value: config.age || '25' },
    { label: 'Smiles Given', value: '∞' },
    { label: 'Memories Made', value: config.photos?.length || '5' },
    { label: 'Candles to Blow', value: '5' },
  ];

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section className="section welcome-section" id="welcome" ref={ref} style={{ overflow: 'hidden', position: 'relative' }}>
      {/* Balloon animation */}
      {showBalloons && balloons.map((b, i) => <FloatingBalloon key={i} {...b} />)}

      {/* Background glow */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px', height: '600px',
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(${theme.glowRgb}, 0.06) 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', position: 'relative', zIndex: 1 }}
      >
        <motion.p variants={itemVariants} className="section-eyebrow">
          🎉 A Very Special Day
        </motion.p>

        <motion.h2 variants={itemVariants} className="section-title" style={{ textAlign: 'center' }}>
          Welcome,<br />
          <span style={{
            fontStyle: 'italic',
            background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {config.name}! 🎂
          </span>
        </motion.h2>

        <motion.p variants={itemVariants} className="section-desc">
          Today marks another incredible year of your amazing journey.
          You deserve all the love, joy, and magic this world has to offer.
          We've prepared something truly special just for you. 🌟
        </motion.p>

        {/* Stats grid */}
        <motion.div variants={itemVariants} className="welcome-grid">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="glass-card welcome-stat"
              whileHover={{ scale: 1.05, y: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <div className="welcome-stat-number">{stat.value}</div>
              <div className="welcome-stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
