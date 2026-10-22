import { useBirthday } from '../../context/BirthdayContext';

const SECTIONS = [
  { id: 'hero', label: 'Welcome' },
  { id: 'welcome', label: 'Birthday' },
  { id: 'memories', label: 'Memories' },
  { id: 'message', label: 'Message' },
  { id: 'cake', label: 'Cake' },
  { id: 'gift', label: 'Gift' },
  { id: 'celebration', label: 'Celebrate' },
];

export default function NavDots({ activeSection }) {
  const { theme } = useBirthday();

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="nav-dots" aria-label="Section navigation">
      {SECTIONS.map(sec => (
        <button
          key={sec.id}
          className={`nav-dot clickable ${activeSection === sec.id ? 'active' : ''}`}
          onClick={() => scrollTo(sec.id)}
          title={sec.label}
          aria-label={sec.label}
        >
          <span className="nav-dot-label">{sec.label}</span>
        </button>
      ))}
    </nav>
  );
}
