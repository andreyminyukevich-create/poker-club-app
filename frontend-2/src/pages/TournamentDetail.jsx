import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getById } from '../api/tournaments'
import { register, cancel, getByTournament, getMyRegistrations } from '../api/registrations'
import { IMAGES, getChipForTournament } from '../config'
import Loader from '../components/Loader'
import ErrorState from '../components/ErrorState'

export default function TournamentDetail({ user }) {
  var params = useParams()
  var id = params.id
  var navigate = useNavigate()
  var [tournament, setTournament] = useState(null)
  var [participants, setParticipants] = useState([])
  var [tab, setTab] = useState('info')
  var [myStatus, setMyStatus] = useState(null)
  var [loading, setLoading] = useState(true)
  var [actionLoading, setActionLoading] = useState(false)
  var [error, setError] = useState(null)
  var [actionError, setActionError] = useState(null)

  function loadAll() {
    setLoading(true)
    setError(null)
    Promise.all([
      getById(id),
      getByTournament(id),
      user ? getMyRegistrations() : Promise.resolve({ ok: true, data: [] }),
    ])
      .then(function(results) {
        if (results[0].ok) setTournament(results[0].data)
        if (results[1].ok) setParticipants(results[1].data)
        if (results[2].ok) {
          var reg = results[2].data.find(function(r) {
            return String(r.tournament_id) === String(id) && r.status !== 'отменён'
          })
          if (reg) setMyStatus(reg.status)
        }
        setLoading(false)
      })
      .catch(function(err) { setError(err.message); setLoading(false) })
  }

  useEffect(loadAll, [id, user])

  function doRegister() {
    if (actionLoading) return
    setActionLoading(true); setActionError(null)
    register(id)
      .then(function(result) {
        if (result.ok) { setMyStatus(result.status); return getByTournament(id) }
        else { throw new Error(result.error) }
      })
      .then(function(data) { if (data && data.ok) setParticipants(data.data); setActionLoading(false) })
      .catch(function(err) { setActionError(err.message); setActionLoading(false) })
  }

  function doCancel() {
    if (actionLoading) return
    setActionLoading(true); setActionError(null)
    cancel(id)
      .then(function(result) {
        if (result.ok) { setMyStatus(null); return getByTournament(id) }
        else { throw new Error(result.error) }
      })
      .then(function(data) { if (data && data.ok) setParticipants(data.data); setActionLoading(false) })
      .catch(function(err) { setActionError(err.message); setActionLoading(false) })
  }

  function formatDate(date, time) {
    if (!date) return ''
    var d = new Date(date)
    var day = String(d.getDate()).padStart(2, '0')
    var month = String(d.getMonth() + 1).padStart(2, '0')
    var timeStr = time ? time.slice(0, 5) : ''
    return day + '.' + month + ' / ' + timeStr
  }

  if (loading) return <div className="page"><Loader /></div>
  if (error) return <div className="page"><ErrorState message={error} onRetry={loadAll} /></div>
  if (!tournament) return <div className="page"><ErrorState message="Турнир не найден" /></div>

  var active = participants.filter(function(p) { return p.status === 'записан' })

  return (
    <div>
      <div style={{
        backgroundImage: 'url(' + IMAGES.bgRed + ')',
        backgroundSize: 'cover', backgroundPosition: 'center',
        padding: '0', position: 'relative', minHeight: '200px',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'
      }}>
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(transparent 10%, rgba(27,45,94,0.85) 60%, rgba(27,45,94,0.98))'
        }}></div>
        <div style={{ position: 'relative', zIndex: 2, padding: '16px' }}>
          <button className="text-gold" style={{
            background: 'none', fontSize: '14px', marginBottom: '16px',
            display: 'flex', alignItems: 'center', gap: '6px'
          }} onClick={function() { navigate(-1) }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            Назад
          </button>
          <h1 className="title-display" style={{ fontSize: '28px' }}>{tournament.name}</h1>
          <div className="flex gap-8 flex-wrap mt-8">
            <span className="badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {tournament.city}
            </span>
            <span className="badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {formatDate(tournament.date, tournament.time)}
            </span>
            <span className="badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
              {active.length} / {tournament.seats}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-8" style={{ padding: '16px', borderBottom: '1px solid var(--gold-dim)' }}>
        <button className={'tab ' + (tab === 'info' ? 'tab-active' : 'tab-inactive')} onClick={function() { setTab('info') }}>
          О турнире
        </button>
        <button className={'tab ' + (tab === 'participants' ? 'tab-active' : 'tab-inactive')} onClick={function() { setTab('participants') }}>
          Участники ({active.length})
        </button>
      </div>

      <div style={{ padding: '16px', paddingBottom: '100px' }}>
        {tab === 'info' && (
          <div>
            {tournament.description && (
              <div className="card mb-16">
                <p className="title-display title-md mb-8 text-gold">Описание</p>
                <p style={{ lineHeight: 1.7, color: 'var(--gray-light)', fontSize: '14px' }}>{tournament.description}</p>
              </div>
            )}

            {actionError && <p className="text-danger text-center mb-12">{actionError}</p>}

            <div className="mt-16">
              {!myStatus && (
                <button className="btn btn-primary" disabled={actionLoading} onClick={doRegister}>
                  {actionLoading ? 'Загрузка...' : 'Записаться'}
                </button>
              )}
              {myStatus === 'записан' && (
                <div>
                  <div className="status-registered mb-12">Вы записаны</div>
                  <button className="btn btn-danger" disabled={actionLoading} onClick={doCancel}>
                    {actionLoading ? 'Загрузка...' : 'Отменить запись'}
                  </button>
                </div>
              )}
              {myStatus === 'лист ожидания' && (
                <div>
                  <div className="status-waitlist mb-12">Вы в листе ожидания</div>
                  <button className="btn btn-danger" disabled={actionLoading} onClick={doCancel}>
                    {actionLoading ? 'Загрузка...' : 'Отменить'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'participants' && (
          <div>
            {active.length === 0 && <p className="text-gray">Пока никто не записался</p>}
            {active.map(function(p, i) {
              var name = (p.users && p.users.nickname) || (p.users && p.users.first_name) || '---'
              var initials = name.slice(0, 2).toUpperCase()
              return (
                <div key={i} className="rating-row">
                  <span className="rating-pos">{i + 1}</span>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: 'var(--bg)', border: '1px solid var(--gold-dim)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '11px', fontWeight: 600, color: 'var(--gray)',
                    marginRight: '10px', flexShrink: 0
                  }}>{initials}</div>
                  <span className="rating-name">{name}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
