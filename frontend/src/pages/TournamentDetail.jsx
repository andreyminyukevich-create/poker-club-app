import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL

export default function TournamentDetail({ user }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tournament, setTournament] = useState(null)
  const [participants, setParticipants] = useState([])
  const [tab, setTab] = useState('info')
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const loadParticipants = () => {
    return fetch(`${API}/api/registrations/tournament/${id}`)
      .then(r => r.json())
      .then(data => { if (data.ok) setParticipants(data.data) })
  }

  useEffect(() => {
    fetch(`${API}/api/tournaments/${id}`)
      .then(r => r.json())
      .then(data => { if (data.ok) setTournament(data.data) })

    loadParticipants()

    if (user) {
      fetch(`${API}/api/registrations/user/${user.id}`)
        .then(r => r.json())
        .then(data => {
          if (data.ok) {
            const reg = data.data.find(
              r => String(r.tournament_id) === String(id) && r.status !== 'отменён'
            )
            if (reg) setStatus(reg.status)
          }
        })
    }
  }, [id, user])

  const register = async () => {
    if (!user) return
    setLoading(true)
    const res = await fetch(`${API}/api/registrations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tg_id: user.id, tournament_id: id })
    }).then(r => r.json())
    if (res.ok) {
      setStatus(res.status)
      await loadParticipants()
    }
    setLoading(false)
  }

  const cancel = async () => {
    if (!user) return
    setLoading(true)
    await fetch(`${API}/api/registrations/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tg_id: user.id, tournament_id: id })
    })
    setStatus(null)
    await loadParticipants()
    setLoading(false)
  }

  const formatDate = (date, time) => {
    if (!date) return ''
    const d = new Date(date)
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const timeStr = time ? time.slice(0, 5) : ''
    return `${day}.${month} / ${timeStr}`
  }

  if (!tournament) return <div style={{ padding: '16px', color: '#8A9BB8' }}>Загрузка...</div>

  const active = participants.filter(p => p.status === 'записан')

  return (
    <div>
      {/* Шапка */}
      <div style={{ background: 'linear-gradient(135deg, #1A6B3C, #0F1E40)', padding: '32px 16px 20px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', color: '#C9A84C', fontSize: '14px', marginBottom: '12px', cursor: 'pointer' }}>
          ← Назад
        </button>
        <h1 style={{ fontSize: '26px', fontWeight: 900 }}>{tournament.name}</h1>
      </div>

      {/* Табы */}
      <div style={{ display: 'flex', gap: '8px', padding: '16px', borderBottom: '1px solid #C9A84C22' }}>
        {['info', 'participants'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '8px 16px', borderRadius: '20px', fontSize: '13px',
            background: tab === t ? '#C9A84C' : '#0F1E40',
            color: tab === t ? '#1B2D5E' : '#8A9BB8',
            border: '1px solid #C9A84C33', fontWeight: tab === t ? 700 : 400,
            cursor: 'pointer'
          }}>
            {t === 'info' ? '🏆 О турнире' : `👥 Участники (${active.length}/${tournament.seats})`}
          </button>
        ))}
      </div>

      <div style={{ padding: '16px' }}>
        {tab === 'info' && (
          <div>
            <h3 style={{ color: '#C9A84C', marginBottom: '8px' }}>Когда и где</h3>
            <p style={{ color: '#8A9BB8', marginBottom: '4px' }}>📍 {tournament.city}</p>
            <p style={{ color: '#8A9BB8', marginBottom: '16px' }}>🕐 {formatDate(tournament.date, tournament.time)}</p>

            {tournament.description && (
              <>
                <h3 style={{ color: '#C9A84C', marginBottom: '8px' }}>Описание</h3>
                <p style={{ color: '#FFFFFF', lineHeight: 1.6, marginBottom: '24px' }}>{tournament.description}</p>
              </>
            )}

            <div style={{ marginTop: '24px' }}>
              {!status && (
                <button onClick={register} disabled={loading} style={{
                  width: '100%', padding: '16px', borderRadius: '12px',
                  background: loading ? '#8A9BB8' : '#C9A84C',
                  color: '#1B2D5E', fontSize: '16px', fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}>
                  {loading ? 'Загрузка...' : 'Записаться'}
                </button>
              )}
              {status === 'записан' && (
                <div>
                  <div style={{
                    background: '#1A6B3C', border: '1px solid #2ecc71',
                    borderRadius: '12px', padding: '14px',
                    marginBottom: '12px', textAlign: 'center',
                    color: '#fff', fontWeight: 700, fontSize: '15px'
                  }}>
                    ✅ Вы записаны
                  </div>
                  <button onClick={cancel} disabled={loading} style={{
                    width: '100%', padding: '14px', borderRadius: '12px',
                    background: '#C0392B', color: '#fff',
                    fontSize: '14px', fontWeight: 700,
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}>
                    {loading ? 'Загрузка...' : 'Отменить запись'}
                  </button>
                </div>
              )}
              {status === 'лист ожидания' && (
                <div>
                  <div style={{
                    background: '#7d6608', border: '1px solid #C9A84C',
                    borderRadius: '12px', padding: '14px',
                    marginBottom: '12px', textAlign: 'center',
                    color: '#fff', fontWeight: 700, fontSize: '15px'
                  }}>
                    ⏳ Вы в листе ожидания
                  </div>
                  <button onClick={cancel} disabled={loading} style={{
                    width: '100%', padding: '14px', borderRadius: '12px',
                    background: '#C0392B', color: '#fff',
                    fontSize: '14px', fontWeight: 700,
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}>
                    {loading ? 'Загрузка...' : 'Отменить'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'participants' && (
          <div>
            {active.length === 0 && <p style={{ color: '#8A9BB8' }}>Пока никто не записался</p>}
            {active.map((p, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 0', borderBottom: '1px solid #C9A84C11'
              }}>
                <span style={{ color: '#C9A84C', fontWeight: 700, width: '24px' }}>{i + 1}</span>
                <span style={{ fontWeight: 600 }}>{p.users?.nickname || p.users?.first_name || '—'}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
