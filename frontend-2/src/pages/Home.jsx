import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAll } from '../api/tournaments'
import { IMAGES, getChipForTournament } from '../config'
import Loader from '../components/Loader'
import ErrorState from '../components/ErrorState'

export default function Home({ user }) {
  var [tournament, setTournament] = useState(null)
  var [loading, setLoading] = useState(true)
  var [error, setError] = useState(null)
  var navigate = useNavigate()

  function load() {
    setLoading(true)
    setError(null)
    var promise = window.__prefetch_tournaments || getAll()
    window.__prefetch_tournaments = null
    promise
      .then(function(data) {
        if (data && data.ok && data.data.length > 0) {
          setTournament(data.data[0])
        }
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
      <div className="mb-16">
        <h1 className="title-display text-gold" style={{ fontSize: '20px', fontStyle: 'italic' }}>
          Московский Покерный Зал
        </h1>
      </div>

      <p className="subtitle mb-8">Ближайший турнир</p>

      {loading && <Loader />}
      {error && <ErrorState message={error} onRetry={load} />}

      {!loading && !error && tournament && (
        <div
          className="card card-tournament mb-16 cursor-pointer"
          onClick={function() { navigate('/tournaments/' + tournament.id) }}
        >
          <div className="card-info">
            <h2 className="title-display title-md mb-8">{tournament.name}</h2>
            <div className="flex gap-8 flex-wrap">
              <span className="badge">{tournament.city}</span>
              <span className="badge">{formatDate(tournament.date, tournament.time)}</span>
            </div>
          </div>
          <img className="card-chip" src={getChipForTournament(0)} alt="" />
        </div>
      )}

      {!loading && !error && !tournament && (
        <div className="card mb-16 text-gray">Нет предстоящих турниров</div>
      )}

      <div
        className="card card-banner mb-16 cursor-pointer"
        style={{ backgroundImage: 'url(' + IMAGES.bannerRating + ')' }}
        onClick={function() { navigate('/rating') }}
      >
        <div className="card-banner-overlay"></div>
        <div className="card-banner-content">
          <h2 className="title-display title-lg mb-4">РЕЙТИНГ</h2>
          <p className="title-display text-gold" style={{ fontSize: '14px', marginBottom: '12px' }}>
            Московский Покерный Зал
          </p>
          <button className="btn btn-outline btn-sm" onClick={function(e) { e.stopPropagation(); navigate('/rating') }}>
            Рейтинг игроков
          </button>
        </div>
      </div>

      <div className="grid-2 mb-12">
        <div className="card cursor-pointer">
          <p className="title-display title-md mb-8">SUPPORT</p>
          <span className="badge">Связаться</span>
        </div>
        <div className="card cursor-pointer">
          <p className="title-display title-md">О КЛУБЕ</p>
        </div>
      </div>

      <div className="card cursor-pointer">
        <p className="title-display title-md">{"Q&A"}</p>
      </div>
    </div>
  )
}
