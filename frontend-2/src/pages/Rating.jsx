import { useState, useEffect } from 'react'
import { getAll } from '../api/ratings'
import { IMAGES } from '../config'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'

export default function Rating() {
  var [ratings, setRatings] = useState([])
  var [search, setSearch] = useState('')
  var [loading, setLoading] = useState(true)
  var [error, setError] = useState(null)

  function load() {
    setLoading(true)
    setError(null)
    getAll()
      .then(function(data) {
        if (data.ok) setRatings(data.data)
        setLoading(false)
      })
      .catch(function(err) {
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(load, [])

  var filtered = ratings.filter(function(r) {
    return (r.nickname || '').toLowerCase().indexOf(search.toLowerCase()) !== -1
  })

  return (
    <div className="page">
      <h1 className="title-display title-xl mb-16" style={{ fontSize: '38px' }}>РЕЙТИНГ</h1>

      <div className="flex gap-8 mb-16" style={{ overflowX: 'auto' }}>
        <button className="tab tab-active">Сезонный</button>
        <button className="tab tab-inactive">Глобальный</button>
      </div>

      <div className="mb-16">
        <div style={{ position: 'relative' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8A9BB8" strokeWidth="2"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            value={search}
            onChange={function(e) { setSearch(e.target.value) }}
            placeholder="Поиск по никнейму"
            className="input"
            style={{ paddingLeft: '40px' }}
          />
        </div>
      </div>

      <div className="flex text-gray text-sm" style={{ padding: '0 8px 8px' }}>
        <span style={{ width: '28px' }}>#</span>
        <span className="flex-1" style={{ paddingLeft: '46px' }}>Никнейм</span>
        <span style={{ width: '50px', textAlign: 'right' }}>Ноки</span>
        <span style={{ width: '60px', textAlign: 'right' }}>Рейтинг</span>
      </div>

      {loading && <Loader />}
      {error && <ErrorState message={error} onRetry={load} />}
      {!loading && !error && filtered.length === 0 && <EmptyState text="Нет данных" />}

      {filtered.map(function(player, i) {
        var initials = (player.nickname || '?').slice(0, 2).toUpperCase()
        return (
          <div key={player.id || i} className="rating-row">
            <span className="rating-pos">{i + 1}</span>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'var(--bg)', border: '1px solid var(--gold-dim)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', fontWeight: '600', color: 'var(--gray)',
              marginRight: '10px', flexShrink: 0
            }}>
              {initials}
            </div>
            <span className="rating-name">{player.nickname}</span>
            <span className="rating-stat">{player.knockouts || 0}</span>
            <span className="rating-points">{player.points || 0}</span>
          </div>
        )
      })}
    </div>
  )
}
