import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL

export default function Home({ user }) {
  const [tournament, setTournament] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${API}/api/tournaments`)
      .then(r => r.json())
      .then(data => {
        if (data.ok && data.data.length > 0) {
          setTournament(data.data[0])
        }
      })
      .catch(console.error)
  }, [])

  const formatDate = (date, time) => {
    if (!date) return ''
    const d = new Date(date)
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const timeStr = time ? time.slice(0, 5) : ''
    return `${day}.${month} / ${timeStr}`
  }

  return (
    <div style={{ padding: '16px' }}>

      {/* Заголовок */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#C9A84C' }}>
          Московский Покерный Зал
        </h1>
      </div>

      {/* Ближайший турнир */}
      <p style={{ color: '#8A9BB8', marginBottom: '8px', fontSize: '13px' }}>Ближайший турнир</p>
      {tournament ? (
        <div onClick={() => navigate(`/tournaments/${tournament.id}`)} style={{
          background: '#0F1E40', borderRadius: '12px', padding: '16px',
          border: '1px solid #C9A84C33', marginBottom: '16px', cursor: 'pointer'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{tournament.name}</h2>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ background: '#1B2D5E', borderRadius: '20px', padding: '4px 10px', fontSize: '12px', color: '#8A9BB8' }}>
              📍 {tournament.city}
            </span>
            <span style={{ background: '#1B2D5E', borderRadius: '20px', padding: '4px 10px', fontSize: '12px', color: '#8A9BB8' }}>
              🕐 {formatDate(tournament.date, tournament.time)}
            </span>
          </div>
        </div>
      ) : (
        <div style={{ background: '#0F1E40', borderRadius: '12px', padding: '16px', marginBottom: '16px', color: '#8A9BB8' }}>
          Нет предстоящих турниров
        </div>
      )}

      {/* Баннер рейтинга */}
      <div onClick={() => navigate('/rating')} style={{
        background: 'linear-gradient(135deg, #1A6B3C, #0F1E40)',
        borderRadius: '12px', padding: '20px', marginBottom: '16px',
        border: '1px solid #1A6B3C', cursor: 'pointer'
      }}>
        <h2 style={{ fontSize: '22px', fontWeight: 900, marginBottom: '8px' }}>РЕЙТИНГ</h2>
        <button style={{
          background: '#C9A84C22', border: '1px solid #C9A84C',
          borderRadius: '20px', padding: '6px 14px',
          color: '#C9A84C', fontSize: '13px', cursor: 'pointer'
        }}>
          ⭐ Рейтинг игроков
        </button>
      </div>

      {/* Кнопки */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
        <div style={{ background: '#0F1E40', borderRadius: '12px', padding: '16px', border: '1px solid #C9A84C33' }}>
          <p style={{ fontWeight: 700, marginBottom: '8px' }}>SUPPORT</p>
          <span style={{ fontSize: '20px' }}>📞</span>
        </div>
        <div style={{ background: '#0F1E40', borderRadius: '12px', padding: '16px', border: '1px solid #C9A84C33' }}>
          <p style={{ fontWeight: 700 }}>О КЛУБЕ</p>
        </div>
      </div>

      <div style={{ background: '#0F1E40', borderRadius: '12px', padding: '16px', border: '1px solid #C9A84C33' }}>
        <p style={{ fontWeight: 700 }}>Q&A</p>
      </div>

    </div>
  )
}
