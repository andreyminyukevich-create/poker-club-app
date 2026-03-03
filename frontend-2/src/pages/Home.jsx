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
          \u041C\u043E\u0441\u043A\u043E\u0432\u0441\u043A\u0438\u0439 \u041F\u043E\u043A\u0435\u0440\u043D\u044B\u0439 \u0417\u0430\u043B
        </h1>
      </div>

      <p className="text-gray text-sm mb-8">\u0411\u043B\u0438\u0436\u0430\u0439\u0448\u0438\u0439 \u0442\u0443\u0440\u043D\u0438\u0440</p>

      {loading && <Loader />}
      {error && <ErrorState message={error} onRetry={load} />}

      {!loading && !error && tournament && (
        <div className="card mb-16 cursor-pointer" onClick={function() { navigate('/tournaments/' + tournament.id) }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{tournament.name}</h2>
          <div className="flex gap-8 flex-wrap">
            <span className="badge">\u{1F4CD} {tournament.city}</span>
            <span className="badge">\u{1F550} {formatDate(tournament.date, tournament.time)}</span>
          </div>
        </div>
      )}

      {!loading && !error && !tournament && (
        <div className="card mb-16 text-gray">\u041D\u0435\u0442 \u043F\u0440\u0435\u0434\u0441\u0442\u043E\u044F\u0449\u0438\u0445 \u0442\u0443\u0440\u043D\u0438\u0440\u043E\u0432</div>
      )}

      <div
        className="card mb-16 cursor-pointer"
        style={{ background: 'linear-gradient(135deg, #1A6B3C, #0F1E40)', borderColor: '#1A6B3C' }}
        onClick={function() { navigate('/rating') }}
      >
        <h2 className="font-black" style={{ fontSize: '22px', marginBottom: '8px' }}>\u0420\u0415\u0419\u0422\u0418\u041D\u0413</h2>
        <button className="btn btn-outline btn-sm">\u2B50 \u0420\u0435\u0439\u0442\u0438\u043D\u0433 \u0438\u0433\u0440\u043E\u043A\u043E\u0432</button>
      </div>

      <div className="grid-2 mb-12">
        <div className="card">
          <p className="font-bold mb-8">SUPPORT</p>
          <span style={{ fontSize: '20px' }}>\u{1F4DE}</span>
        </div>
        <div className="card">
          <p className="font-bold">\u041E \u041A\u041B\u0423\u0411\u0415</p>
        </div>
      </div>

      <div className="card">
        <p className="font-bold">Q&A</p>
      </div>
    </div>
  )
}
