import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAll } from '../api/tournaments'
import { IMAGES, getChipForTournament } from '../config'
import Loader from '../components/Loader'
import ErrorState from '../components/ErrorState'

// TODO: заменить на реальный аккаунт поддержки
var SUPPORT_TG = 'poker_club_admin'

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

  function openSupport() {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.openTelegramLink('https://t.me/' + SUPPORT_TG)
    } else {
      window.open('https://t.me/' + SUPPORT_TG, '_blank')
    }
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
        <div className="card cursor-pointer" onClick={openSupport}>
          <div className="flex" style={{ gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2">
              <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
            </svg>
            <p className="title-display title-md">SUPPORT</p>
          </div>
          <span className="badge">Написать</span>
        </div>
        <div className="card cursor-pointer" onClick={function() { navigate('/about') }}>
          <div className="flex" style={{ gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            <p className="title-display title-md">О КЛУБЕ</p>
          </div>
          <span className="badge">Подробнее</span>
        </div>
      </div>

      <div className="card cursor-pointer" onClick={function() { navigate('/faq') }}>
        <div className="flex" style={{ gap: '10px', alignItems: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <p className="title-display title-md">{"Q&A"}</p>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gray)" strokeWidth="2" style={{ marginLeft: 'auto' }}>
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </div>
      </div>
    </div>
  )
}
