import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getById } from '../api/tournaments'
import { register, cancel, getByTournament, getMyRegistrations } from '../api/registrations'
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
            return String(r.tournament_id) === String(id) && r.status !== '\u043E\u0442\u043C\u0435\u043D\u0451\u043D'
          })
          if (reg) setMyStatus(reg.status)
        }
        setLoading(false)
      })
      .catch(function(err) {
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(loadAll, [id, user])

  function doRegister() {
    if (actionLoading) return
    setActionLoading(true)
    setActionError(null)
    register(id)
      .then(function(result) {
        if (result.ok) {
          setMyStatus(result.status)
          return getByTournament(id)
        } else {
          throw new Error(result.error)
        }
      })
      .then(function(data) {
        if (data && data.ok) setParticipants(data.data)
        setActionLoading(false)
      })
      .catch(function(err) {
        setActionError(err.message)
        setActionLoading(false)
      })
  }

  function doCancel() {
    if (actionLoading) return
    setActionLoading(true)
    setActionError(null)
    cancel(id)
      .then(function(result) {
        if (result.ok) {
          setMyStatus(null)
          return getByTournament(id)
        } else {
          throw new Error(result.error)
        }
      })
      .then(function(data) {
        if (data && data.ok) setParticipants(data.data)
        setActionLoading(false)
      })
      .catch(function(err) {
        setActionError(err.message)
        setActionLoading(false)
      })
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
  if (!tournament) return <div className="page"><ErrorState message="\u0422\u0443\u0440\u043D\u0438\u0440 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D" /></div>

  var active = participants.filter(function(p) { return p.status === '\u0437\u0430\u043F\u0438\u0441\u0430\u043D' })

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #1A6B3C, #0F1E40)', padding: '32px 16px 20px' }}>
        <button className="text-gold" style={{ background: 'none', fontSize: '14px', marginBottom: '12px' }} onClick={function() { navigate(-1) }}>
          \u2190 \u041D\u0430\u0437\u0430\u0434
        </button>
        <h1 className="font-black" style={{ fontSize: '26px' }}>{tournament.name}</h1>
      </div>

      <div className="flex gap-8" style={{ padding: '16px', borderBottom: '1px solid #C9A84C22' }}>
        <button className={'tab ' + (tab === 'info' ? 'tab-active' : 'tab-inactive')} onClick={function() { setTab('info') }}>
          \u{1F3C6} \u041E \u0442\u0443\u0440\u043D\u0438\u0440\u0435
        </button>
        <button className={'tab ' + (tab === 'participants' ? 'tab-active' : 'tab-inactive')} onClick={function() { setTab('participants') }}>
          \u{1F465} \u0423\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u0438 ({active.length}/{tournament.seats})
        </button>
      </div>

      <div style={{ padding: '16px' }}>
        {tab === 'info' && (
          <div>
            <h3 className="text-gold mb-8">\u041A\u043E\u0433\u0434\u0430 \u0438 \u0433\u0434\u0435</h3>
            <p className="text-gray mb-4">\u{1F4CD} {tournament.city}</p>
            <p className="text-gray mb-16">\u{1F550} {formatDate(tournament.date, tournament.time)}</p>

            {tournament.description && (
              <div className="mb-24">
                <h3 className="text-gold mb-8">\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435</h3>
                <p style={{ lineHeight: 1.6 }}>{tournament.description}</p>
              </div>
            )}

            {actionError && <p className="text-danger text-center mb-12">\u26A0\uFE0F {actionError}</p>}

            <div className="mt-24">
              {!myStatus && (
                <button className="btn btn-primary" disabled={actionLoading} onClick={doRegister}>
                  {actionLoading ? '\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430...' : '\u0417\u0430\u043F\u0438\u0441\u0430\u0442\u044C\u0441\u044F'}
                </button>
              )}
              {myStatus === '\u0437\u0430\u043F\u0438\u0441\u0430\u043D' && (
                <div>
                  <div className="status-registered mb-12">\u2705 \u0412\u044B \u0437\u0430\u043F\u0438\u0441\u0430\u043D\u044B</div>
                  <button className="btn btn-danger" disabled={actionLoading} onClick={doCancel}>
                    {actionLoading ? '\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430...' : '\u041E\u0442\u043C\u0435\u043D\u0438\u0442\u044C \u0437\u0430\u043F\u0438\u0441\u044C'}
                  </button>
                </div>
              )}
              {myStatus === '\u043B\u0438\u0441\u0442 \u043E\u0436\u0438\u0434\u0430\u043D\u0438\u044F' && (
                <div>
                  <div className="status-waitlist mb-12">\u23F3 \u0412\u044B \u0432 \u043B\u0438\u0441\u0442\u0435 \u043E\u0436\u0438\u0434\u0430\u043D\u0438\u044F</div>
                  <button className="btn btn-danger" disabled={actionLoading} onClick={doCancel}>
                    {actionLoading ? '\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430...' : '\u041E\u0442\u043C\u0435\u043D\u0438\u0442\u044C'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'participants' && (
          <div>
            {active.length === 0 && <p className="text-gray">\u041F\u043E\u043A\u0430 \u043D\u0438\u043A\u0442\u043E \u043D\u0435 \u0437\u0430\u043F\u0438\u0441\u0430\u043B\u0441\u044F</p>}
            {active.map(function(p, i) {
              return (
                <div key={i} className="flex" style={{ alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid #C9A84C11' }}>
                  <span className="text-gold font-bold" style={{ width: '24px' }}>{i + 1}</span>
                  <span className="font-bold">{(p.users && p.users.nickname) || (p.users && p.users.first_name) || '\u2014'}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
