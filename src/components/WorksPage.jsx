import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RippleDistortion from './ui/RippleDistortion';

function WorkModal({ work, onClose }) {
  const [tab, setTab] = useState('preview');

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.85)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(8px)'
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '80vw', height: '80vh',
          background: '#000',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '20px',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center',
          padding: '1rem 1.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          gap: '1rem'
        }}>
          <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#fff', flex: 1, fontFamily: 'ui-monospace, monospace' }}>
            {work.title}
          </h2>
          <button
            onClick={() => setTab('preview')}
            style={{
              background: tab === 'preview' ? '#fff' : 'transparent',
              color: tab === 'preview' ? '#000' : 'rgba(255,255,255,0.5)',
              border: '1px solid rgba(255,255,255,0.2)',
              padding: '0.3rem 0.9rem', borderRadius: '6px',
              cursor: 'pointer', fontSize: '0.78rem', fontFamily: 'ui-monospace, monospace',
              letterSpacing: '0.08em'
            }}
          >
            Preview
          </button>
          <button
            onClick={() => setTab('code')}
            style={{
              background: tab === 'code' ? '#fff' : 'transparent',
              color: tab === 'code' ? '#000' : 'rgba(255,255,255,0.5)',
              border: '1px solid rgba(255,255,255,0.2)',
              padding: '0.3rem 0.9rem', borderRadius: '6px',
              cursor: 'pointer', fontSize: '0.78rem', fontFamily: 'ui-monospace, monospace',
              letterSpacing: '0.08em'
            }}
          >
            Code
          </button>
          <button
            onClick={onClose}
            style={{
              background: 'transparent', border: 'none',
              color: 'rgba(255,255,255,0.4)', cursor: 'pointer',
              fontSize: '1.3rem', lineHeight: 1, padding: '0 0.2rem'
            }}
          >
            ×
          </button>
        </div>

        <div style={{ flex: 1, overflow: 'hidden' }}>
          {tab === 'preview' ? (
            <iframe
              title="preview"
              srcDoc={work.html}
              style={{ width: '100%', height: '100%', border: 'none', background: '#fff' }}
              sandbox="allow-scripts"
            />
          ) : (
            <pre style={{
              margin: 0, padding: '1.5rem',
              height: '100%', overflow: 'auto',
              fontSize: '0.75rem', color: '#4ade80',
              fontFamily: 'ui-monospace, monospace',
              whiteSpace: 'pre-wrap', wordBreak: 'break-all'
            }}>
              {work.html}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}

export default function WorksPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const works = JSON.parse(localStorage.getItem('sable_works') || '[]').reverse();

  return (
    <div style={{ position: 'relative', width: '100vw', minHeight: '100vh', background: '#000' }}>
      <div style={{ position: 'fixed', inset: 0 }}>
        <RippleDistortion
          src="https://images.unsplash.com/photo-1782977389500-dd7adad33ebe?q=80&w=3416&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          brushSize={200} strength={0.2} swirl={1} rings={3}
          tint="#ffffff" tintAmount={0.06} grayscale={true}
          trigger="hover" quality="low"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      <div style={{ position: 'relative', zIndex: 10, padding: '2.5rem', minHeight: '100vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
          <h1 style={{
            margin: 0, fontSize: '3rem', fontWeight: 900,
            letterSpacing: '-0.05em', textTransform: 'uppercase', color: '#fff',
            fontFamily: 'ui-monospace, monospace'
          }}>
            My Works
          </h1>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'transparent', border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff', padding: '0.35rem 1rem', borderRadius: '6px',
              cursor: 'pointer', fontFamily: 'ui-monospace, monospace',
              fontSize: '0.85rem', letterSpacing: '0.05em'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
          >
            ← Back
          </button>
        </div>

        {works.length === 0 ? (
          <p style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'ui-monospace, monospace', fontSize: '0.9rem' }}>
            No works yet. Generate something first.
          </p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {works.map((work, i) => (
              <div
                key={i}
                onClick={() => setSelected(work)}
                style={{
                  background: '#000', border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '16px', overflow: 'hidden', cursor: 'pointer',
                  transition: 'border-color 0.2s, transform 0.2s'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ height: '160px', overflow: 'hidden', background: '#fff', pointerEvents: 'none' }}>
                  <iframe
                    title={work.title}
                    srcDoc={work.html}
                    style={{ width: '100%', height: '100%', border: 'none', transform: 'scale(1)', transformOrigin: 'top left' }}
                    sandbox="allow-scripts"
                  />
                </div>
                <div style={{ padding: '1rem' }}>
                  <h3 style={{ margin: 0, color: '#fff', fontSize: '1rem', fontWeight: 700, fontFamily: 'ui-monospace, monospace' }}>
                    {work.title}
                  </h3>
                  <p style={{ margin: '0.3rem 0 0', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'ui-monospace, monospace' }}>
                    {new Date(work.savedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && <WorkModal work={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
