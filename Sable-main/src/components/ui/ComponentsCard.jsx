export default function ComponentCard({ title, subtitle, image, link, onClick }) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        background: '#000',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#fff';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {image && (
        <div style={{ width: '100%', height: '160px', background: '#0a0a0f', overflow: 'hidden' }}>
          <img
            src={image}
            alt={title}
            style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }}
          />
        </div>
      )}
      <div style={{ padding: '1.2rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
          {title}
        </h3>
        {subtitle && (
          <p style={{ margin: '0.35rem 0 0', fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.6)' }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}