import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBirthday } from '../../context/BirthdayContext';
import { themes } from '../../themes/themes';

const FONTS = [
  'Playfair Display', 'Inter', 'Dancing Script', 'Outfit', 'Cormorant Garamond',
];

const INTENSITY_OPTS = ['minimal', 'normal', 'full'];

function Toggle({ value, onChange }) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={value} onChange={e => onChange(e.target.checked)} />
      <span className="toggle-slider" />
    </label>
  );
}

function Section({ title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="panel-section">
      <button
        className="panel-section-title"
        onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', background: 'none', border: 'none', color: 'inherit', padding: 0, fontFamily: 'inherit', fontSize: 'inherit', letterSpacing: 'inherit', textTransform: 'inherit', borderBottom: 'inherit', marginBottom: open ? '1rem' : 0 }}
      >
        {title}
        <span style={{ fontSize: '0.9rem', opacity: 0.5 }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && children}
    </div>
  );
}

export default function CustomizationPanel() {
  const {
    config, updateConfig, updatePhoto,
    theme, panelOpen, setPanelOpen,
  } = useBirthday();

  return (
    <>
      {/* Toggle button */}
      <motion.button
        className="panel-toggle clickable"
        onClick={() => setPanelOpen(o => !o)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Customize"
      >
        ⚙️
      </motion.button>

      {/* Backdrop */}
      <div
        className={`panel-overlay ${panelOpen ? 'open' : ''}`}
        onClick={() => setPanelOpen(false)}
      />

      {/* Panel */}
      <div className={`customization-panel ${panelOpen ? 'open' : ''}`}>
        <div className="panel-header">
          <span className="panel-title">✨ Customize</span>
          <button className="panel-close clickable" onClick={() => setPanelOpen(false)}>✕</button>
        </div>

        {/* ── Person ── */}
        <Section title="👤 Birthday Person">
          <div className="panel-field">
            <label className="panel-label">Name</label>
            <input
              className="panel-input"
              value={config.name}
              onChange={e => updateConfig('name', e.target.value)}
              placeholder="Birthday person's name"
            />
          </div>
          <div className="panel-field">
            <label className="panel-label">Age</label>
            <input
              className="panel-input"
              type="number"
              value={config.age}
              onChange={e => updateConfig('age', e.target.value)}
              placeholder="Age"
              min={1} max={150}
            />
          </div>
        </Section>

        {/* ── Message ── */}
        <Section title="💌 Messages">
          <div className="panel-field">
            <label className="panel-label">Birthday Message</label>
            <textarea
              className="panel-input panel-textarea"
              value={config.message}
              onChange={e => updateConfig('message', e.target.value)}
            />
          </div>
          <div className="panel-field">
            <label className="panel-label">Gift Surprise Message</label>
            <textarea
              className="panel-input panel-textarea"
              style={{ minHeight: '70px' }}
              value={config.giftContent}
              onChange={e => updateConfig('giftContent', e.target.value)}
            />
          </div>
          <div className="panel-field">
            <label className="panel-label">Final Greeting</label>
            <input
              className="panel-input"
              value={config.finalGreeting}
              onChange={e => updateConfig('finalGreeting', e.target.value)}
            />
          </div>
        </Section>

        {/* ── Theme ── */}
        <Section title="🎨 Theme">
          <div className="theme-grid">
            {Object.values(themes).map(t => (
              <button
                key={t.id}
                className={`theme-btn clickable ${config.theme === t.id ? 'active' : ''}`}
                onClick={() => updateConfig('theme', t.id)}
              >
                <span className="theme-dot" style={{ background: t.primary }} />
                {t.name}
              </button>
            ))}
          </div>
        </Section>

        {/* ── Font ── */}
        <Section title="🔤 Typography">
          <div className="panel-field">
            <label className="panel-label">Font</label>
            <select
              className="panel-input panel-select"
              value={config.font}
              onChange={e => updateConfig('font', e.target.value)}
            >
              {FONTS.map(f => (
                <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
              ))}
            </select>
          </div>
        </Section>

        {/* ── Memories ── */}
        <Section title="📸 Memories">
          {config.photos.map((photo, i) => (
            <div key={photo.id} className="panel-field" style={{ marginBottom: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '1rem' }}>
              <label className="panel-label">Photo {i + 1} Caption</label>
              <input
                className="panel-input"
                value={photo.caption}
                onChange={e => updatePhoto(photo.id, { caption: e.target.value })}
                style={{ marginBottom: '0.5rem' }}
              />
              <label className="panel-label">Date</label>
              <input
                className="panel-input"
                value={photo.date}
                onChange={e => updatePhoto(photo.id, { date: e.target.value })}
              />
            </div>
          ))}
        </Section>

        {/* ── Animation & Effects ── */}
        <Section title="✨ Effects">
          <div className="panel-field">
            <label className="panel-label">Animation Intensity</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem' }}>
              {INTENSITY_OPTS.map(opt => (
                <button
                  key={opt}
                  className={`btn-ghost clickable`}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    fontSize: '0.75rem',
                    borderColor: config.animationIntensity === opt ? 'var(--primary)' : undefined,
                    color: config.animationIntensity === opt ? 'var(--primary)' : undefined,
                  }}
                  onClick={() => updateConfig('animationIntensity', opt)}
                >
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="toggle-row">
            <span className="toggle-label">🌸 Bloom Effect</span>
            <Toggle value={config.bloomEnabled} onChange={v => updateConfig('bloomEnabled', v)} />
          </div>
          <div className="toggle-row">
            <span className="toggle-label">✨ Particles</span>
            <Toggle value={config.particlesEnabled} onChange={v => updateConfig('particlesEnabled', v)} />
          </div>
          <div className="toggle-row">
            <span className="toggle-label">🎆 Fireworks</span>
            <Toggle value={config.fireworksEnabled} onChange={v => updateConfig('fireworksEnabled', v)} />
          </div>
        </Section>

        {/* ── Music ── */}
        <Section title="🎵 Music">
          <div className="toggle-row">
            <span className="toggle-label">Enable Music</span>
            <Toggle value={config.musicEnabled} onChange={v => updateConfig('musicEnabled', v)} />
          </div>
          {config.musicEnabled && (
            <div className="panel-field" style={{ marginTop: '0.5rem' }}>
              <label className="panel-label">Volume</label>
              <input
                type="range"
                className="panel-range"
                min={0} max={1} step={0.05}
                value={config.musicVolume}
                onChange={e => updateConfig('musicVolume', parseFloat(e.target.value))}
              />
            </div>
          )}
        </Section>

        <div style={{ marginTop: '2rem', padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: '"Outfit", sans-serif', lineHeight: 1.5 }}>
            All changes apply instantly ✨
          </p>
        </div>
      </div>
    </>
  );
}
