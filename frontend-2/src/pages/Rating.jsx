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
        \u0420\u0415\u0419\u0422\u0418\u041D\u0413
      </h1>

      <div className="mb-16" style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} className="text-gray">
          \u{1F50D}
        </span>
        <input
          value={search}
          onChange={function(e) { setSearch(e.target.value) }}
          placeholder="\u041F\u043E\u0438\u0441\u043A \u043F\u043E \u043D\u0438\u043A\u043D\u0435\u0439\u043C\u0443"
          className="input"
          style={{ paddingLeft: '36px', borderColor: '#C9A84C33' }}
        />
      </div>

      <div className="flex text-gray text-sm" style={{ padding: '0 8px 8px' }}>
        <span style={{ width: '32px' }}>#</span>
        <span className="flex-1">\u041D\u0438\u043A\u043D\u0435\u0439\u043C</span>
        <span style={{ width: '50px', textAlign: 'right' }}>\u041D\u043E\u043A\u0438</span>
        <span style={{ width: '70px', textAlign: 'right' }}>\u041E\u0447\u043A\u0438</span>
      </div>

      {loading && <Loader />}
      {error && <ErrorState message={error} onRetry={load} />}
      {!loading && !error && filtered.length === 0 && <EmptyState text="\u041D\u0435\u0442 \u0434\u0430\u043D\u043D\u044B\u0445" />}

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
