import { useEffect, useRef } from 'react';
import { useBirthday } from '../../context/BirthdayContext';

export default function LoadingScreen({ progress, done }) {
  const { theme } = useBirthday();
  const ref = useRef(null);

  useEffect(() => {
    if (done && ref.current) {
      ref.current.style.opacity = '0';
      ref.current.style.pointerEvents = 'none';
    }
  }, [done]);

  const messages = [
    'Lighting the candles…',
    'Inflating the balloons…',
    'Wrapping your gift…',
    'Setting up fireworks…',
    'Almost ready! 🎂',
  ];
  const msgIdx = Math.min(Math.floor(progress / 21), messages.length - 1);

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
        transition: 'opacity 1s ease',
      }}
    >
      {/* Animated Birthday emoji */}
      <div style={{ fontSize: '4rem', animation: 'float 3s ease-in-out infinite' }}>🎂</div>

      <div
        style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
          color: theme.primary,
          textShadow: `0 0 40px ${theme.primary}99`,
          letterSpacing: '0.08em',
        }}
      >
        Happy Birthday ✨
      </div>

      {/* Progress bar */}
      <div style={{ width: 'min(360px, 80vw)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div
          style={{
            height: '3px',
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '99px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${theme.primary}, ${theme.accent})`,
              borderRadius: '99px',
              boxShadow: `0 0 12px ${theme.primary}cc`,
              transition: 'width 0.4s ease',
            }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: '"Outfit", sans-serif',
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: '0.1em',
          }}
        >
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>{messages[msgIdx]}</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Particle dots */}
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
        {[0, 1, 2].map(i => (
          <div
            key={i}
            style={{
              width: '6px', height: '6px',
              borderRadius: '50%',
              background: theme.primary,
              boxShadow: `0 0 8px ${theme.primary}`,
              animation: `blink 1.2s ease-in-out ${i * 0.25}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
