export default function Loader() {
  return (
    <div className="flex-center" style={{ padding: '40px 0' }}>
      <div style={{
        width: '32px', height: '32px',
        border: '3px solid var(--gold-dim)',
        borderTop: '3px solid var(--gold)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }}></div>
      <style>{
        '@keyframes spin { to { transform: rotate(360deg); } }'
      }</style>
    </div>
  )
}
