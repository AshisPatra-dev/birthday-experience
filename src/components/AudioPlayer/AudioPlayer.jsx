import { useState, useRef, useEffect } from 'react';
import { useBirthday } from '../../context/BirthdayContext';

export default function AudioPlayer() {
  const { config, updateConfig, theme } = useBirthday();
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  // Use a public domain birthday/lofi track
  const TRACK_URL = 'https://www.bensound.com/bensound-music/bensound-sunny.mp3';

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(TRACK_URL);
      audioRef.current.loop = true;
    }
    audioRef.current.volume = config.musicVolume;
  }, [config.musicVolume]);

  const toggle = async () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setPlaying(true);
      } catch (e) {
        console.log('Audio autoplay blocked:', e.message);
      }
    }
  };

  useEffect(() => {
    return () => audioRef.current?.pause();
  }, []);

  return (
    <div className="audio-player">
      <button className="audio-btn clickable" onClick={toggle} title={playing ? 'Pause Music' : 'Play Music'}>
        {playing ? '⏸' : '▶'}
      </button>

      <span style={{ fontSize: '0.75rem', color: theme.textMuted, fontFamily: '"Outfit", sans-serif', whiteSpace: 'nowrap', maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {playing ? '🎵 Playing' : 'Music'}
      </span>

      <input
        type="range"
        className="volume-slider"
        min={0} max={1} step={0.05}
        value={config.musicVolume}
        onChange={e => updateConfig('musicVolume', parseFloat(e.target.value))}
        title="Volume"
      />
    </div>
  );
}
