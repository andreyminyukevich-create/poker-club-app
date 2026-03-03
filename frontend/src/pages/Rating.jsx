import { useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL

export default function Rating() {
  const [ratings, setRatings] = useState([])
  const [tab, setTab] = useState('global')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/api/ratings`)
      .then(r => r.json())
      .then(data => {
        if (data.ok) setRatings(data.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filtered = ratings.filter(r =>
    r.Никнейм?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ padding: '16px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#C9A84C', marginBottom: '16px' }}>
        РЕЙТИНГ
      </h1>

      {/* Табы */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {[
          { key: 'season', label: 'Сезонный' },
          { key: 'global', label: 'Глобальный' },
          { key: 'friends', label: 'Друзья' }
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '8px 14px', borderRadius: '20px', fontSize: '13px',
            background: tab === t.key ? '#C9A84C' : '#0F1E40',
            color: tab === t.key ? '#1B2D5E' : '#8A9BB8',
            border: '1px solid #C9A84C33', fontWeight: tab === t.key ? 700 : 400
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Поиск */}
      <div style={{ marginBottom: '16px', position: 'relative' }}>
        <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8A9BB8' }}>🔍</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Поиск по никнейму"
          style={{
            width: '100%', padding: '10px 12px 10px 36px',
            background: '#0F1E40', border: '1px solid #C9A84C33',
            borderRadius: '10px', color: '#fff', fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* Заголовок таблицы */}
      <div style={{ display: 'flex', padding: '0 8px 8px', color: '#8A9BB8', fontSize: '12px' }}>
        <span style={{ flex: 1 }}>Никнейм</span>
        <span style={{ width: '50px', textAlign: 'right' }}>Ноки</span>
        <span style={{ width: '70px', textAlign: 'right' }}>Рейтинг</span>
      </div>

      {loading && <p style={{ color: '#8A9BB8' }}>Загрузка...</p>}

      {!loading && filtered.length === 0 && (
        <p style={{ color: '#8A9BB8', textAlign: 'center', marginTop: '32px' }}>Нет данных</p>
      )}

      {filtered.map((player, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center',
          padding: '12px 8px', borderBottom: '1px solid #C9A84C11'
        }}>
          <span style={{ color: '#8A9BB8', width: '24px', fontSize: '14px' }}>{i + 1}</span>
          <span style={{ flex: 1, marginLeft: '12px', fontWeight: 600 }}>{player.Никнейм}</span>
          <span style={{ width: '50px', textAlign: 'right', color: '#8A9BB8' }}>{player.Ноки || 0}</span>
          <span style={{ width: '70px', textAlign: 'right', color: '#C9A84C', fontWeight: 700 }}>{player.Очки || 0}</span>
        </div>
      ))}
    </div>
  )
}
