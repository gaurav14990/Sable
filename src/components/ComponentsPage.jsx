import { useNavigate } from 'react-router-dom';
import GlowCursor from './ui/GlowCursor';
import ComponentCard from './ui/ComponentsCard';

const COMPONENTS_DATA = [
  {
    title: 'Glow Cursor',
    subtitle: 'Animation',
    link: 'https://reactbits.dev/animations/glow-cursor',
    image: 'https://reactbits.dev/og/animations/glow-cursor.jpg'
  },
  {
    title: 'CRT Warp',
    subtitle: 'Background',
    link: 'https://reactbits.dev/backgrounds/crt-warp',
    image: 'https://reactbits.dev/og/backgrounds/crt-warp.jpg'
  },
  {
    title: 'Light Tunnel',
    subtitle: 'Background',
    link: 'https://reactbits.dev/backgrounds/light-tunnel',
    image: 'https://reactbits.dev/og/backgrounds/light-tunnel.jpg'
  },
  {
    title: 'Ripple Distortion',
    subtitle: 'Animation',
    link: 'https://reactbits.dev/animations/ripple-distortion',
    image: 'https://reactbits.dev/og/animations/ripple-distortion.jpg'
  },
  {
    title: 'Balatro',
    subtitle: 'Background',
    link: 'https://reactbits.dev/backgrounds/balatro',
    image: 'https://reactbits.dev/og/backgrounds/balatro.jpg'
  },
  {
    title: 'Liquid Chrome',
    subtitle: 'Background',
    link: 'https://reactbits.dev/backgrounds/liquid-chrome',
    image: 'https://reactbits.dev/og/backgrounds/liquid-chrome.jpg'
  },
  {
    title: 'Topography',
    subtitle: 'Background',
    link: 'https://reactbits.dev/backgrounds/topography',
    image: 'https://reactbits.dev/og/backgrounds/topography.jpg'
  },
  {
    title: 'Grid Scan',
    subtitle: 'Background',
    link: 'https://reactbits.dev/backgrounds/grid-scan',
    image: 'https://reactbits.dev/og/backgrounds/grid-scan.jpg'
  }
];

export default function ComponentsPage() {
  const navigate = useNavigate();

  return (
    <GlowCursor
      color="#5f8bff"
      intensity={1.3}
      trailWidth={3}
      linger={1.4}
      glow={1.2}
      clickBurst
      theme="dark"
      style={{
        minHeight: '100vh',
        width: '100%',
        background: '#030407',
        color: '#fff',
        fontFamily: 'ui-monospace, monospace'
      }}
    >
      <div
        style={{
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          padding: '2.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h1
            style={{
              fontSize: '3rem',
              fontWeight: 900,
              letterSpacing: '-0.05em',
              textTransform: 'uppercase',
              margin: 0
            }}
          >
            Components
          </h1>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
              padding: '0.35rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              letterSpacing: '0.05em',
              fontSize: '0.85rem',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            ← Back
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {COMPONENTS_DATA.map((item) => (
            <ComponentCard
              key={item.title}
              title={item.title}
              subtitle={item.subtitle}
              image={item.image}
              link={item.link}
              onClick={item.path ? () => navigate(item.path) : undefined}
            />
          ))}
        </div>
      </div>
    </GlowCursor>
  );
}
