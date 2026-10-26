import { useNavigate } from 'react-router-dom';
import RippleDistortion from './ui/RippleDistortion';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#000' }}>
      <RippleDistortion
        src="https://images.unsplash.com/photo-1782977389500-dd7adad33ebe?q=80&w=3416&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        brushSize={180}
        strength={0.25}
        swirl={1.2}
        rings={4}
        fade={3}
        tint="#5f8bff"
        tintAmount={0.12}
        grayscale={true}
        trigger="hover"
        quality="medium"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />

      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
        pointerEvents: 'none'
      }}>
        <h1 style={{
          fontSize: 'clamp(3rem, 8vw, 7rem)',
          fontWeight: 900,
          letterSpacing: '-0.04em',
          color: '#fff',
          margin: 0,
          textAlign: 'center',
          lineHeight: 1
        }}>
          SABLE
        </h1>
        <p style={{
          fontSize: 'clamp(0.9rem, 2vw, 1.2rem)',
          color: 'rgba(255,255,255,0.55)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          margin: 0,
          fontFamily: 'ui-monospace, monospace'
        }}>
          AI Landing Page Generator
        </p>

        <div style={{ display: 'flex', gap: '1rem', pointerEvents: 'all', marginTop: '0.5rem' }}>
          <button
            onClick={() => navigate('/app')}
            style={{
              background: '#fff',
              color: '#000',
              border: 'none',
              padding: '0.75rem 2rem',
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '0.05em',
              transition: 'opacity 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Start Building →
          </button>
          <button
            onClick={() => navigate('/components')}
            style={{
              background: 'transparent',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '0.75rem 2rem',
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '0.05em',
              transition: 'border-color 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.7)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'}
          >
            Components
          </button>
        </div>
      </div>
    </div>
  );
}
