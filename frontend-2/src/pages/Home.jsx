import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAll } from '../api/tournaments'
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
    getAll()
      .then(function(data) {
        if (data.ok && data.data.length > 0) {
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
      <div className="flex-between mb-16">
        <h1 className="text-gold" style={{ fontSize: '20px', fontWeight: 700 }}>
          Московский Покерный Зал
        </h1>
      </div>

      <p className="text-gray text-sm mb-8">Ближайший турнир</p>

      {loading && <Loader />}
      {error && <ErrorState message={error} onRetry={load} />}

      {!loading && !error && tournament && (
        <div className="card mb-16 cursor-pointer" onClick={function() { navigate('/tournaments/' + tournament.id) }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{tournament.name}</h2>
          <div className="flex gap-8 flex-wrap">
            <span className="badge">{tournament.city}</span>
            <span className="badge">{formatDate(tournament.date, tournament.time)}</span>
          </div>
        </div>
      )}

      {!loading && !error && !tournament && (
        <div className="card mb-16 text-gray">Нет предстоящих турниров</div>
      )}

      <div
        className="card mb-16 cursor-pointer"
        style={{ background: 'linear-gradient(135deg, #1A6B3C, #0F1E40)', borderColor: '#1A6B3C' }}
        onClick={function() { navigate('/rating') }}
      >
        <h2 className="font-black" style={{ fontSize: '22px', marginBottom: '8px' }}>РЕЙТИНГ</h2>
        <button className="btn btn-outline btn-sm">Рейтинг игроков</button>
      </div>

      <div className="grid-2 mb-12">
        <div className="card">
          <p className="font-bold mb-8">SUPPORT</p>
        </div>
        <div className="card">
          <p className="font-bold">О КЛУБЕ</p>
        </div>
      </div>

      <div className="card">
        <p className="font-bold">Q&A</p>
      </div>
    </div>
  )
}      <div className="grid-2 mb-12">
        <div className="card">
          <p className="font-bold mb-8">SUPPORT</p>
        </div>
        <div className="card">
          <p className="font-bold">О КЛУБЕ</p>
        </div>
      </div>

      <div className="card">
        <p className="font-bold">Q&A</p>
      </div>
    </div>
  )
}      <div className="grid-2 mb-12">
        <div className="card">
          <p className="font-bold mb-8">SUPPORT</p>
          <span style={{ fontSize: '20px' }}>\u{1F4DE}</span>
        </div>
        <div className="card">
          <p className="font-bold">\u041E \u041A\u041B\u0423\u0411\u0415</p>
        </div>
      </div>

      <div className="card">
        <p className="font-bold">{"Q&A"}</p>
      </div>
    </div>
  )
}
