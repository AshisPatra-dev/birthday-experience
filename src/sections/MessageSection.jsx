import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useBirthday } from '../context/BirthdayContext';

function useTypewriter(text, speed = 35, active = false) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active) return;
    setDisplayed('');
    setDone(false);
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        setDone(true);
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, active, speed]);

  return { displayed, done };
}

export default function MessageSection() {
  const { config, theme } = useBirthday();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-120px' });
  const { displayed, done } = useTypewriter(config.message, 30, inView);

  return (
    <section className="section message-section" id="message" ref={ref}>
      {/* Background glow orb */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '700px', height: '500px',
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(${theme.glowRgb}, 0.08) 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}
      >
        <p className="section-eyebrow">💌 From the Heart</p>
        <h2 className="section-title">A Special Message</h2>
      </motion.div>

      <motion.div
        className="glass-card message-card"
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        {/* Decorative quotes */}
        <div className="message-deco top" style={{ color: theme.primary }}>"</div>
        <div className="message-deco bottom" style={{ color: theme.primary }}>"</div>

        <p className="message-quote" style={{ color: theme.text }}>
          {displayed}
          {!done && <span className="message-cursor" style={{ background: theme.primary }} />}
        </p>
      </motion.div>

      {/* Signature */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={done ? { opacity: 1 } : {}}
        transition={{ duration: 1 }}
        style={{
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <p style={{
          fontFamily: '"Dancing Script", cursive',
          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
          color: theme.primary,
          filter: `drop-shadow(0 0 15px rgba(${theme.glowRgb}, 0.6))`,
        }}>
          With all the love in the world 💕
        </p>
      </motion.div>
    </section>
  );
}
