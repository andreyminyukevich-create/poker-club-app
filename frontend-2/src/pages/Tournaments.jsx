import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAll } from '../api/tournaments'
import { getChipForTournament } from '../config'
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
      <h1 className="title-display title-xl text-gold mb-16">ТУРНИРЫ</h1>

      {loading && <Loader />}
      {error && <ErrorState message={error} onRetry={load} />}
      {!loading && !error && tournaments.length === 0 && <EmptyState text="Нет предстоящих турниров" />}

      {tournaments.map(function(t, i) {
        return (
          <div
            key={t.id}
            className="card card-tournament mb-12 cursor-pointer"
            onClick={function() { navigate('/tournaments/' + t.id) }}
          >
            <div className="card-info">
              <h2 className="title-display title-md mb-8">{t.name}</h2>
              <div className="flex gap-8 flex-wrap">
                <span className="badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
                  {t.seats} мест
                </span>
                <span className="badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {formatDate(t.date, t.time)}
                </span>
              </div>
            </div>
            <img className="card-chip" src={getChipForTournament(i)} alt="" />
          </div>
        )
      })}
    </div>
  )
}
