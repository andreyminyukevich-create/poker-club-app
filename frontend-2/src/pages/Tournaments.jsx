import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAll } from '../api/tournaments'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'

export default function Tournaments() {
  var [tournaments, setTournaments] = useState([])
  var [loading, setLoading] = useState(true)
  var [error, setError] = useState(null)
  var navigate = useNavigate()

  function load() {
    setLoading(true)
    setError(null)
    getAll()
      .then(function(data) {
        if (data.ok) setTournaments(data.data)
        setLoading(false)
      })
      .catch(function(err) {
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(load, [])

  function formatDate(date, time) {
    if (!date) return ''
    var d = new Date(date)
    var day = String(d.getDate()).padStart(2, '0')
    var month = String(d.getMonth() + 1).padStart(2, '0')
    var timeStr = time ? time.slice(0, 5) : ''
    return day + '.' + month + ' / ' + timeStr
  }

  return (
    <div className="page">
      <h1 className="text-gold font-black mb-16" style={{ fontSize: '24px' }}>
        \u0422\u0423\u0420\u041D\u0418\u0420\u042B
      </h1>

      {loading && <Loader />}
      {error && <ErrorState message={error} onRetry={load} />}
      {!loading && !error && tournaments.length === 0 && <EmptyState text="\u041D\u0435\u0442 \u043F\u0440\u0435\u0434\u0441\u0442\u043E\u044F\u0449\u0438\u0445 \u0442\u0443\u0440\u043D\u0438\u0440\u043E\u0432" />}

      {tournaments.map(function(t) {
        return (
          <div key={t.id} className="card mb-12 cursor-pointer" onClick={function() { navigate('/tournaments/' + t.id) }}>
            <div className="flex-between">
              <div className="flex-1">
                <h2 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '8px' }}>{t.name}</h2>
                <div className="flex gap-8 flex-wrap">
                  <span className="badge">\u{1F465} {t.seats} \u043C\u0435\u0441\u0442</span>
                  <span className="badge">\u{1F550} {formatDate(t.date, t.time)}</span>
                </div>
              </div>
              <span style={{ fontSize: '28px', marginLeft: '12px' }}>\u2660\uFE0F</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
