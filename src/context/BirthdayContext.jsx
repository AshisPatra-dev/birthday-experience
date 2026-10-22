import { createContext, useContext, useState } from 'react';
import { themes } from '../themes/themes';

const BirthdayContext = createContext(null);

export const defaultConfig = {
  name: 'Alex',
  age: '25',
  message: `Every year, you light up the world a little more.
Today is YOUR day — a celebration of everything you are,
everything you've done, and everything you're yet to become.
Wishing you a year full of magic, laughter, and endless joy. 🎉`,
  surpriseMessage: '✨ You are truly one of a kind. The world is so much better with you in it. Keep shining! 🌟',
  theme: 'luxuryGold',
  font: 'Playfair Display',
  animationIntensity: 'full', // 'minimal' | 'normal' | 'full'
  musicEnabled: false,
  musicVolume: 0.4,
  musicTrack: 'birthday_jazz',
  bloomEnabled: true,
  particlesEnabled: true,
  fireworksEnabled: true,
  dofEnabled: false,
  confettiStyle: 'classic',
  balloonStyle: 'classic',
  cakeStyle: 'layered',
  fireworksStyle: 'grand',
  photos: [
    { id: 1, url: null, caption: 'A wonderful memory', date: '2024' },
    { id: 2, url: null, caption: 'Laughing together', date: '2023' },
    { id: 3, url: null, caption: 'An adventure', date: '2023' },
    { id: 4, url: null, caption: 'Pure joy', date: '2022' },
    { id: 5, url: null, caption: 'Unforgettable moment', date: '2022' },
  ],
  finalGreeting: 'Happy Birthday, [NAME]! 🎂',
  giftContent: 'A world full of happiness, health, and love — just for you! 🎁',
};

export function BirthdayProvider({ children }) {
  const [config, setConfig] = useState(defaultConfig);
  const [panelOpen, setPanelOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('hero');
  const [candlesLit, setCandlesLit] = useState(5);
  const [giftOpened, setGiftOpened] = useState(false);
  const [celebrationActive, setCelebrationActive] = useState(false);
  const [experienceStarted, setExperienceStarted] = useState(false);

  const theme = themes[config.theme] || themes.luxuryGold;

  const updateConfig = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const updatePhoto = (id, data) => {
    setConfig(prev => ({
      ...prev,
      photos: prev.photos.map(p => p.id === id ? { ...p, ...data } : p),
    }));
  };

  return (
    <BirthdayContext.Provider value={{
      config, updateConfig, updatePhoto,
      theme,
      panelOpen, setPanelOpen,
      currentSection, setCurrentSection,
      candlesLit, setCandlesLit,
      giftOpened, setGiftOpened,
      celebrationActive, setCelebrationActive,
      experienceStarted, setExperienceStarted,
    }}>
      {children}
    </BirthdayContext.Provider>
  );
}

export const useBirthday = () => {
  const ctx = useContext(BirthdayContext);
  if (!ctx) throw new Error('useBirthday must be inside BirthdayProvider');
  return ctx;
};
