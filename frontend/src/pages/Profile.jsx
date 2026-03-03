import { useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL

export default function Profile({ user }) {
  const [profile, setProfile] = useState(null)
  const [history, setHistory] = useState([])
  const [editingNick, setEditingNick] = useState(false)
  const [editingCity, setEditingCity] = useState(false)
  const [newNick, setNewNick] = useState('')
  const [newCity, setNewCity] = useState('')
  const [saving, setSaving] = useState(false)
  const [nickError, setNickError] = useState('')

  useEffect(() => {
    if (!user) return
    fetch(`${API}/api/users/${user.id}`)
      .then(r => r.json())
      .then(data => {
        if (data.ok) {
          setProfile(data.data)
          setNewNick(data.data.Никнейм || '')
          setNewCity(data.data.Город || '')
        }
      })

    fetch(`${API}/api/registrations/user/${user.id}`)
      .then(r => r.json())
      .then(data => { if (data.ok) setHistory(data.data) })
  }, [user])

  const saveNickname = async () => {
    if (!newNick.trim()) return
    setSaving(true)
    setNickError('')
    const res = await fetch(`${API}/api/users/${user.id}/nickname`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nickname: newNick.trim() })
    }).then(r => r.json())

    if (res.ok) {
      setProfile(p => ({ ...p, Никнейм: newNick.trim() }))
      setEditingNick(false)
    } else {
      setNickError(res.error || 'Ошибка сохранения')
    }
    setSaving(false)
  }

  const saveCity = async () => {
    if (!newCity.trim()) return
    setSaving(true)
    await fetch(`${API}/api/users/${user.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tg_id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        city: newCity.trim()
      })
    })
    setProfile(p => ({ ...p, Город: newCity.trim() }))
    setEditingCity(false)
    setSaving(false)
  }

  if (!user) return (
    <div style={{ padding: '32px 16px', textAlign: 'center', color: '#8A9BB8' }}>
      Откройте приложение через Telegram
    </div>
  )

  const inputStyle = {
    width: '100%', padding: '10px 12px',
    background: '#1B2D5E', border: '1px solid #C9A84C',
    borderRadius: '8px', color: '#fff', fontSize: '15px',
    boxSizing: 'border-box', marginBottom: '8px'
  }

  const btnStyle = (color) => ({
    padding: '8px 16px', borderRadius: '8px', fontSize: '13px',
    background: color === '#C9A84C' ? '#C9A84C' : 'transparent',
    color: color === '#C9A84C' ? '#1B2D5E' : '#8A9BB8',
    border: `1px solid ${color}`, fontWeight: 700, cursor: 'pointer', marginRight: '8px'
  })

  return (
    <div style={{ padding: '16px' }}>

      {/* Шапка */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%',
          background: '#0F1E40', border: '2px solid #C9A84C',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '28px', overflow: 'hidden', flexShrink: 0
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

      {/* Никнейм */}
      <div style={{ background: '#0F1E40', borderRadius: '12px', padding: '16px', border: '1px solid #C9A84C33', marginBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: editingNick ? '12px' : '0' }}>
          <div>
            <p style={{ color: '#8A9BB8', fontSize: '12px', marginBottom: '2px' }}>НИКНЕЙМ</p>
            {!editingNick && <p style={{ fontWeight: 700 }}>⭐ {profile?.Никнейм || '—'}</p>}
          </div>
          {!editingNick && (
            <button onClick={() => { setEditingNick(true); setNickError('') }} style={{ background: 'none', color: '#C9A84C', fontSize: '13px', cursor: 'pointer' }}>
              ✏️ Изменить
            </button>
          )}
        </div>
        {editingNick && (
          <div>
            <input
              value={newNick}
              onChange={e => { setNewNick(e.target.value); setNickError('') }}
              placeholder="Введите никнейм"
              style={{ ...inputStyle, borderColor: nickError ? '#C0392B' : '#C9A84C' }}
            />
            {nickError && (
              <p style={{ color: '#C0392B', fontSize: '12px', marginBottom: '8px' }}>⚠️ {nickError}</p>
            )}
            <div>
              <button onClick={saveNickname} disabled={saving} style={btnStyle('#C9A84C')}>
                {saving ? 'Сохраняю...' : 'Сохранить'}
              </button>
              <button onClick={() => { setEditingNick(false); setNickError('') }} style={btnStyle('#8A9BB8')}>
                Отмена
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Город */}
      <div style={{ background: '#0F1E40', borderRadius: '12px', padding: '16px', border: '1px solid #C9A84C33', marginBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: editingCity ? '12px' : '0' }}>
          <div>
            <p style={{ color: '#8A9BB8', fontSize: '12px', marginBottom: '2px' }}>МОЙ ГОРОД</p>
            {!editingCity && <p style={{ fontWeight: 700 }}>🏙 {profile?.Город || 'Не указан'}</p>}
          </div>
          {!editingCity && (
            <button onClick={() => setEditingCity(true)} style={{ background: 'none', color: '#C9A84C', fontSize: '13px', cursor: 'pointer' }}>
              ✏️ Изменить
            </button>
          )}
        </div>
        {editingCity && (
          <div>
            <input
              value={newCity}
              onChange={e => setNewCity(e.target.value)}
              placeholder="Введите город"
              style={inputStyle}
            />
            <div>
              <button onClick={saveCity} disabled={saving} style={btnStyle('#C9A84C')}>
                {saving ? 'Сохраняю...' : 'Сохранить'}
              </button>
              <button onClick={() => setEditingCity(false)} style={btnStyle('#8A9BB8')}>
                Отмена
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Турниры */}
      <div style={{ background: '#0F1E40', borderRadius: '12px', padding: '16px', border: '1px solid #C9A84C33', marginBottom: '12px' }}>
        <p style={{ color: '#8A9BB8', fontSize: '12px', marginBottom: '2px' }}>ТУРНИРЫ</p>
        <p style={{ fontWeight: 700 }}>🎴 {history.length}</p>
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
            <span style={{ color: h.Статус === 'записан' ? '#1A6B3C' : '#C9A84C' }}>{h.Статус}</span>
          </div>
        ))}
      </div>

    </div>
  )
}            }}>{h.Статус}</span>
          </div>
        ))}
      </div>

    </div>
  )
}
