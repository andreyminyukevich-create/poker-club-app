import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL

export default function Tournaments() {
  const [tournaments, setTournaments] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${API}/api/tournaments`)
      .then(r => r.json())
      .then(data => {
        if (data.ok) setTournaments(data.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div style={{ padding: '16px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#C9A84C', marginBottom: '16px' }}>
        ТУРНИРЫ
      </h1>

      {loading && <p style={{ color: '#8A9BB8' }}>Загрузка...</p>}

      {!loading && tournaments.length === 0 && (
        <p style={{ color: '#8A9BB8' }}>Нет предстоящих турниров</p>
      )}

      {tournaments.map(t => (
        <div key={t.ID} onClick={() => navigate(`/tournaments/${t.ID}`)} style={{
          background: '#0F1E40', borderRadius: '12px', padding: '16px',
          marginBottom: '12px', border: '1px solid #C9A84C33', cursor: 'pointer'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '8px' }}>{t.Название}</h2>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ background: '#1B2D5E', borderRadius: '20px', padding: '4px 10px', fontSize: '12px', color: '#8A9BB8' }}>
                  👥 {t['Мест всего']} мест
                </span>
                <span style={{ background: '#1B2D5E', borderRadius: '20px', padding: '4px 10px', fontSize: '12px', color: '#8A9BB8' }}>
                  🕐 {t.Дата} / {t.Время}
                </span>
              </div>
            </div>
            <span style={{ fontSize: '28px', marginLeft: '12px' }}>♠️</span>
          </div>
        </div>
      ))}
    </div>
  )
}
