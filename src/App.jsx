import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BirthdayProvider, useBirthday } from './context/BirthdayContext';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import CustomCursor from './components/CustomCursor/CustomCursor';
import NavDots from './components/NavDots/NavDots';
import AudioPlayer from './components/AudioPlayer/AudioPlayer';
import CustomizationPanel from './components/CustomizationPanel/CustomizationPanel';
import HeroSection from './sections/HeroSection';
import WelcomeSection from './sections/WelcomeSection';
import MemoriesSection from './sections/MemoriesSection';
import MessageSection from './sections/MessageSection';
import CakeSection from './sections/CakeSection';
import GiftSection from './sections/GiftSection';
import CelebrationSection from './sections/CelebrationSection';

// Theme injector into CSS vars
function ThemeInjector() {
  const { theme, config } = useBirthday();

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--bg', theme.bg);
    root.style.setProperty('--bg-gradient', theme.bgGradient);
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--secondary', theme.secondary);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--text', theme.text);
    root.style.setProperty('--text-muted', theme.textMuted);
    root.style.setProperty('--card-bg', theme.cardBg);
    root.style.setProperty('--card-border', theme.cardBorder);
    root.style.setProperty('--glow', theme.glow);
    root.style.setProperty('--glow-rgb', theme.glowRgb);
    document.body.style.background = theme.bg;
    document.body.style.backgroundImage = theme.bgGradient;
    // Font
    document.documentElement.style.setProperty('--font-display', `"${config.font}", serif`);
  }, [theme, config.font]);

  return null;
}

function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return <div className="scroll-progress" style={{ width: `${progress}%` }} />;
}

function useActiveSection() {
  const [active, setActive] = useState('hero');

  useEffect(() => {
    const sections = ['hero', 'welcome', 'memories', 'message', 'cake', 'gift', 'celebration'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { threshold: 0.4 }
    );

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return active;
}

function BirthdayApp() {
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadDone, setLoadDone] = useState(false);
  const [started, setStarted] = useState(false);
  const activeSection = useActiveSection();

  // Simulate loading
  useEffect(() => {
    const steps = [20, 45, 65, 80, 95, 100];
    const delays = [300, 700, 1200, 1800, 2400, 3000];
    const timers = steps.map((target, i) =>
      setTimeout(() => {
        setLoadProgress(target);
        if (i === steps.length - 1) {
          setTimeout(() => setLoadDone(true), 500);
        }
      }, delays[i])
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleStart = () => {
    setStarted(true);
    setTimeout(() => {
      document.getElementById('welcome')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <>
      <ThemeInjector />
      <CustomCursor />
      <LoadingScreen progress={loadProgress} done={loadDone} />

      {loadDone && (
        <>
          <ScrollProgressBar />
          <NavDots activeSection={activeSection} />
          <AudioPlayer />
          <CustomizationPanel />

          <main id="app-root">
            <HeroSection onStart={handleStart} />
            <WelcomeSection />
            <MemoriesSection />
            <MessageSection />
            <CakeSection />
            <GiftSection />
            <CelebrationSection />
          </main>
        </>
      )}
    </>
  );
}

export default function App() {
  return (
    <BirthdayProvider>
      <BirthdayApp />
    </BirthdayProvider>
  );
}
