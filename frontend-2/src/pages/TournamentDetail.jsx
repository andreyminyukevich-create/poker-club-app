import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getById } from '../api/tournaments'
import { register, cancel, getByTournament, getMyRegistrations } from '../api/registrations'
import { IMAGES, getChipForTournament } from '../config'
import Loader from '../components/Loader'
import ErrorState from '../components/ErrorState'

function FeatureCard({ icon, label, value }) {
  return (
    <div style={{
      background: 'var(--bg)', borderRadius: '12px',
      padding: '12px', display: 'flex', alignItems: 'center', gap: '10px'
    }}>
      <div style={{
        width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
        background: 'var(--gold-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        {icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <p className="text-gray" style={{ fontSize: '11px', marginBottom: '2px' }}>{label}</p>
        <p style={{ fontSize: '14px', fontWeight: 600 }}>{value}</p>
      </div>
    </div>
  )
}

function parseFeatures(description) {
  if (!description) return { intro: '', features: [], structure: '' }
  var text = description
  var intro = ''
  var features = []
  var structure = ''

  var lines = text.split('\n').map(function(l) { return l.trim() }).filter(function(l) { return l })

  var section = 'intro'
  var introLines = []
  var structureLines = []

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i]
    var lower = line.toLowerCase()

    if (lower.indexOf('особенност') !== -1 && lower.indexOf('турнир') !== -1) {
      section = 'features'
      continue
    }
    if (lower.indexOf('структура') !== -1) {
      section = 'structure'
      continue
    }

    if (section === 'intro') {
      if (lower.indexOf('описание') !== -1) continue
      introLines.push(line)
    } else if (section === 'features') {
      var clean = line.replace(/^[-•·]\s*/, '').replace(/^—\s*/, '')
      if (!clean) continue

      var feat = { text: clean, icon: 'default' }
      var cl = clean.toLowerCase()
      if (cl.indexOf('формат') !== -1 || cl.indexOf('правила') !== -1 || cl.indexOf('холдем') !== -1 || cl.indexOf('холлем') !== -1) feat.icon = 'format'
      else if (cl.indexOf('стек') !== -1 || cl.indexOf('фишек') !== -1) feat.icon = 'stack'
      else if (cl.indexOf('уровн') !== -1 || cl.indexOf('минут') !== -1) feat.icon = 'clock'
      else if (cl.indexOf('вход') !== -1 || cl.indexOf('ограничен') !== -1) feat.icon = 'entry'
      else if (cl.indexOf('гарантия') !== -1 && cl.indexOf('очков') !== -1 && cl.indexOf('выбит') === -1) feat.icon = 'rating'
      else if (cl.indexOf('баунти') !== -1 || cl.indexOf('выбит') !== -1 || cl.indexOf('нокаут') !== -1) feat.icon = 'bounty'
      else if (cl.indexOf('майбах') !== -1 || cl.indexOf('победител') !== -1 || cl.indexOf('приз') !== -1) feat.icon = 'prize'
      features.push(feat)
    } else if (section === 'structure') {
      structureLines.push(line)
    }
  }

  intro = introLines.join(' ')
  structure = structureLines.join('\n')
  return { intro: intro, features: features, structure: structure }
}

function FeatureIcon({ type }) {
  var s = { width: '18', height: '18', viewBox: '0 0 24 24', fill: 'none', stroke: 'var(--gold)', strokeWidth: '2' }
  if (type === 'format') return <svg {...s}><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
  if (type === 'stack') return <svg {...s}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
  if (type === 'clock') return <svg {...s}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  if (type === 'entry') return <svg {...s}><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
  if (type === 'rating') return <svg {...s}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
  if (type === 'bounty') return <svg {...s}><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
  if (type === 'prize') return <svg {...s}><path d="M6 9H4.5a2.5 2.5 0 010-5H6"/><path d="M18 9h1.5a2.5 2.5 0 000-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"/><path d="M18 2H6v7a6 6 0 1012 0V2z"/></svg>
  return <svg {...s}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
}

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
    var months = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря']
    var d = new Date(date)
    var day = d.getDate()
    var month = months[d.getMonth()]
    var timeStr = time ? time.slice(0, 5) : ''
    return day + ' ' + month + (timeStr ? ', ' + timeStr : '')
  }

  function formatShortDate(date, time) {
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
  var parsed = parseFeatures(tournament.description)

  return (
    <div>
      <div style={{
        backgroundImage: 'url(' + IMAGES.bgRed + ')',
        backgroundSize: 'cover', backgroundPosition: 'center',
        position: 'relative', minHeight: '220px',
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
          <h1 className="title-display" style={{ fontSize: '28px', marginBottom: '4px' }}>{tournament.name}</h1>
          <p className="text-gold" style={{ fontSize: '15px', fontWeight: 500 }}>{formatDate(tournament.date, tournament.time)}</p>
        </div>
      </div>

      <div style={{ padding: '16px', marginTop: '-1px', background: 'var(--bg)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '16px' }}>
          <FeatureCard
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>}
            label="Мест"
            value={active.length + ' / ' + tournament.seats}
          />
          <FeatureCard
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
            label="Время"
            value={tournament.time ? tournament.time.slice(0, 5) : '—'}
          />
          <FeatureCard
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>}
            label="Город"
            value={tournament.city || '—'}
          />
        </div>
      </div>

      <div className="flex gap-8" style={{ padding: '0 16px 16px', borderBottom: '1px solid var(--gold-dim)' }}>
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
            {parsed.intro && (
              <div className="card mb-16">
                <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'var(--gray-light)' }}>{parsed.intro}</p>
              </div>
            )}

            {parsed.features.length > 0 && (
              <div className="mb-16">
                <p className="title-display title-md text-gold mb-12">Особенности турнира</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {parsed.features.map(function(f, i) {
                    return (
                      <div key={i} className="card" style={{ padding: '12px 14px' }}>
                        <div className="flex" style={{ alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                            background: 'var(--gold-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}>
                            <FeatureIcon type={f.icon} />
                          </div>
                          <p style={{ fontSize: '14px', fontWeight: 500 }}>{f.text}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {parsed.structure && (
              <div className="card mb-16">
                <p className="title-display title-md text-gold mb-12">Структура турнира</p>
                <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--gray-light)', whiteSpace: 'pre-line' }}>{parsed.structure}</p>
              </div>
            )}

            {!parsed.intro && parsed.features.length === 0 && tournament.description && (
              <div className="card mb-16">
                <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--gray-light)', whiteSpace: 'pre-line' }}>{tournament.description}</p>
              </div>
            )}

            {actionError && <p className="text-danger text-center mb-12">{actionError}</p>}

            <div className="mt-16">
              {!myStatus && (
                <button className="btn btn-primary" disabled={actionLoading} onClick={doRegister}>
                  {actionLoading ? 'Загрузка...' : 'Записаться на турнир'}
                </button>
              )}
              {myStatus === 'записан' && (
                <div>
                  <div className="status-registered mb-12">
                    <div className="flex-center" style={{ gap: '8px' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      Вы записаны
                    </div>
                  </div>
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
              var name = (p.users && p.users.nickname) || (p.users && p.users.first_name) || '—'
              var initials = name.slice(0, 2).toUpperCase()
              var photoUrl = (p.users && p.users.photo_url) || null
              return (
                <div key={i} className="rating-row">
                  <span className="rating-pos">{i + 1}</span>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: 'var(--bg)', border: '1px solid var(--gold-dim)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '11px', fontWeight: 600, color: 'var(--gray)',
                    marginRight: '10px', flexShrink: 0, overflow: 'hidden'
                  }}>
                    {photoUrl
                      ? <img src={photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : initials
                    }
                  </div>
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
