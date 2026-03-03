import { useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL

export default function Profile({ user }) {
  const [profile, setProfile] = useState(null)
  const [history, setHistory] = useState([])

  useEffect(() => {
    if (!user) return
    fetch(`${API}/api/users/${user.id}`)
      .then(r => r.json())
      .then(data => { if (data.ok) setProfile(data.data) })

    fetch(`${API}/api/registrations/user/${user.id}`)
      .then(r => r.json())
      .then(data => { if (data.ok) setHistory(data.data) })
  }, [user])

  if (!user) return (
    <div style={{ padding: '32px 16px', textAlign: 'center', color: '#8A9BB8' }}>
      Откройте приложение через Telegram
    </div>
  )

  return (
    <div style={{ padding: '16px' }}>

      {/* Шапка профиля */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%',
          background: '#0F1E40', border: '2px solid #C9A84C',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '28px', overflow: 'hidden'
        }}>
          {user.photo_url
            ? <img src={user.photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : '👤'
          }
        </div>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700 }}>
            {profile?.Никнейм || user.first_name}
          </h2>
          <p style={{ color: '#8A9BB8', fontSize: '13px' }}>
            {user.username ? `@${user.username}` : ''}
          </p>
        </div>
      </div>

      {/* Карточки */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        <div style={{ background: '#0F1E40', borderRadius: '12px', padding: '16px', border: '1px solid #C9A84C33' }}>
          <p style={{ color: '#8A9BB8', fontSize: '12px', marginBottom: '4px' }}>МОЙ ГОРОД</p>
          <p style={{ fontWeight: 700 }}>🏙 {profile?.Город || 'Не указан'}</p>
        </div>
        <div style={{ background: '#0F1E40', borderRadius: '12px', padding: '16px', border: '1px solid #C9A84C33' }}>
          <p style={{ color: '#8A9BB8', fontSize: '12px', marginBottom: '4px' }}>ТУРНИРЫ</p>
          <p style={{ fontWeight: 700 }}>🎴 {history.length}</p>
        </div>
      </div>

      {/* История игр */}
      <div style={{ background: '#0F1E40', borderRadius: '12px', padding: '16px', border: '1px solid #C9A84C33' }}>
        <p style={{ fontWeight: 700, marginBottom: '12px' }}>ИСТОРИЯ ИГР</p>
        {history.length === 0 && (
          <p style={{ color: '#8A9BB8', fontSize: '13px' }}>Вы ещё не участвовали в турнирах</p>
        )}
        {history.map((h, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #C9A84C11', fontSize: '13px' }}>
            <span style={{ color: '#8A9BB8' }}>{h['Дата записи']}</span>
            <span style={{
              color: h.Статус === 'записан' ? '#1A6B3C' : '#C9A84C'
            }}>{h.Статус}</span>
          </div>
        ))}
      </div>

    </div>
  )
}
