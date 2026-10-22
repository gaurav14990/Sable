import { useNavigate } from 'react-router-dom';
import GlowCursor from './ui/GlowCursor';
import ComponentCard from './ui/ComponentsCard';
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
        {/* <p style={{ opacity: 0.5, fontSize: '0.9rem', letterSpacing: '0.1em' }}>
          Component library — coming soon.
        </p> */}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1rem',
          }}
        >
          <ComponentCard
            title="Glow Cursor"
            description="Cursor trail with glow and click burst."
            onClick={() => navigate('/components/glow-cursor')}
          />
        </div>
      </div>
    </GlowCursor>
  );
}

