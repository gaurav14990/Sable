export default function ComponentCard({ title, description, onClick }) {
    return (
        <div onClick={onClick}
            style={{
                background: '#000', border: '1px solid white',
                borderRadius: '16px', padding: '1.25rem', cursor: 'pointer'
            }}><h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{title}</h3>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem', opacity: 0.5 }}>
                {description}
            </p>

        </div>
    );

}