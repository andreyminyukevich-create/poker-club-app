import { useNavigate, useLocation } from 'react-router-dom'

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const tabs = [
    { path: '/', icon: '🏠', label: 'Главная' },
    { path: '/tournaments', icon: '🏆', label: 'Турниры' },
    { path: '/rating', icon: '⭐', label: 'Рейтинг' },
    { path: '/profile', icon: '👤', label: 'Профиль' },
  ]

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: '#0F1E40',
      borderTop: '1px solid #C9A84C33',
      display: 'flex',
      padding: '8px 0',
      zIndex: 100
    }}>
      {tabs.map(tab => {
        const active = location.pathname === tab.path
        return (
          <button key={tab.path} onClick={() => navigate(tab.path)} style={{
            flex: 1, background: 'none', border: 'none',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: '2px', padding: '4px',
            color: active ? '#C9A84C' : '#8A9BB8',
            fontSize: '10px', cursor: 'pointer'
          }}>
            <span style={{ fontSize: '22px' }}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
