import { useState, useEffect } from 'react'
import { getAll } from '../api/ratings'
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
      <h1 className="text-gold font-black mb-16" style={{ fontSize: '32px' }}>
        РЕЙТИНГ
      </h1>

      <div className="mb-16">
        <input
          value={search}
          onChange={function(e) { setSearch(e.target.value) }}
          placeholder="Поиск по никнейму"
          className="input"
          style={{ borderColor: '#C9A84C33' }}
        />
      </div>

      <div className="flex text-gray text-sm" style={{ padding: '0 8px 8px' }}>
        <span style={{ width: '32px' }}>#</span>
        <span className="flex-1">Никнейм</span>
        <span style={{ width: '50px', textAlign: 'right' }}>Ноки</span>
        <span style={{ width: '70px', textAlign: 'right' }}>Очки</span>
      </div>

      {loading && <Loader />}
      {error && <ErrorState message={error} onRetry={load} />}
      {!loading && !error && filtered.length === 0 && <EmptyState text="Нет данных" />}

      {filtered.map(function(player, i) {
        return (
          <div key={player.id || i} className="flex" style={{ alignItems: 'center', padding: '12px 8px', borderBottom: '1px solid #C9A84C11' }}>
            <span className="text-gray" style={{ width: '32px', fontSize: '14px' }}>{i + 1}</span>
            <span className="flex-1 font-bold">{player.nickname}</span>
            <span className="text-gray" style={{ width: '50px', textAlign: 'right' }}>{player.knockouts || 0}</span>
            <span className="text-gold font-bold" style={{ width: '70px', textAlign: 'right' }}>{player.points || 0}</span>
          </div>
        )
      })}
    </div>
  )
}
