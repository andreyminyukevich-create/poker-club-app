import { useState, useEffect } from 'react'
import { getMe, updateNickname, updateCity } from '../api/users'
import { getMyRegistrations } from '../api/registrations'
import Loader from '../components/Loader'
import ErrorState from '../components/ErrorState'

export default function Profile({ user, profile, setProfile }) {
  var [history, setHistory] = useState([])
  var [editingNick, setEditingNick] = useState(false)
  var [editingCity, setEditingCity] = useState(false)
  var [newNick, setNewNick] = useState('')
  var [newCity, setNewCity] = useState('')
  var [saving, setSaving] = useState(false)
  var [nickError, setNickError] = useState('')
  var [loading, setLoading] = useState(true)
  var [error, setError] = useState(null)

  function load() {
    if (!user) { setLoading(false); return }
    setLoading(true)
    setError(null)
    Promise.all([
      getMe().catch(function() { return { ok: false } }),
      getMyRegistrations().catch(function() { return { ok: true, data: [] } }),
    ])
      .then(function(results) {
        if (results[0].ok && results[0].data) {
          setProfile(results[0].data)
          setNewNick(results[0].data.nickname || '')
          setNewCity(results[0].data.city || '')
        }
        if (results[1].ok) setHistory(results[1].data || [])
        setLoading(false)
      })
      .catch(function(err) {
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(load, [user])

  function saveNickname() {
    if (!newNick.trim() || saving) return
    setSaving(true)
    setNickError('')
    updateNickname(newNick.trim())
      .then(function(res) {
        if (res.ok) {
          setProfile(function(p) { return Object.assign({}, p, { nickname: newNick.trim() }) })
          setEditingNick(false)
        } else {
          setNickError(res.error || res.message || 'Ошибка')
        }
        setSaving(false)
      })
      .catch(function(err) {
        setNickError(err.message || 'Ошибка сохранения')
        setSaving(false)
      })
  }

  function saveCity() {
    if (!newCity.trim() || saving) return
    setSaving(true)
    updateCity(newCity.trim())
      .then(function() {
        setProfile(function(p) { return Object.assign({}, p, { city: newCity.trim() }) })
        setEditingCity(false)
        setSaving(false)
      })
      .catch(function() { setSaving(false) })
  }

  function formatDate(dateStr) {
    if (!dateStr) return ''
    var d = new Date(dateStr)
    return String(d.getDate()).padStart(2, '0') + '.' + String(d.getMonth() + 1).padStart(2, '0') + '.' + d.getFullYear()
  }

  if (!user) return <div className="page text-center text-gray">Откройте приложение через Telegram</div>
  if (loading) return <div className="page"><Loader /></div>
  if (error) return <div className="page"><ErrorState message={error} onRetry={load} /></div>

  return (
    <div className="page">
      <div className="flex mb-24" style={{ alignItems: 'center', gap: '16px' }}>
        <div className="flex-center" style={{
          width: '64px', height: '64px', borderRadius: '50%',
          background: 'var(--bg-card)', border: '2px solid var(--gold)',
          fontSize: '16px', overflow: 'hidden', flexShrink: 0
        }}>
          {user.photo_url
            ? <img src={user.photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : 'U'
          }
        </div>
        <div>
          <h2 style={{ fontSize: '18px' }} className="font-bold">
            {(profile && profile.nickname) || user.first_name}
          </h2>
          <p className="text-gray text-sm">{user.username ? '@' + user.username : ''}</p>
        </div>
      </div>

      <div className="card mb-12">
        <div className="flex-between" style={{ marginBottom: editingNick ? '12px' : '0' }}>
          <div>
            <p className="text-gray text-sm mb-4">НИКНЕЙМ</p>
            {!editingNick && <p className="font-bold">{(profile && profile.nickname) || '\u2014'}</p>}
          </div>
          {!editingNick && (
            <button style={{ background: 'none', color: 'var(--gold)', fontSize: '13px' }}
              onClick={function() { setEditingNick(true); setNickError('') }}>
              Изменить
            </button>
          )}
        </div>
        {editingNick && (
          <div>
            <input value={newNick}
              onChange={function(e) { setNewNick(e.target.value); setNickError('') }}
              placeholder="Введите никнейм"
              className={'input mb-8 ' + (nickError ? 'input-error' : '')}
            />
            {nickError && <p className="text-danger text-sm mb-8">{nickError}</p>}
            <div className="flex gap-8">
              <button className="btn btn-primary btn-sm" disabled={saving} onClick={saveNickname}>
                {saving ? 'Сохраняю...' : 'Сохранить'}
              </button>
              <button className="btn btn-outline btn-sm" onClick={function() { setEditingNick(false); setNickError('') }}>
                Отмена
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="card mb-12">
        <div className="flex-between" style={{ marginBottom: editingCity ? '12px' : '0' }}>
          <div>
            <p className="text-gray text-sm mb-4">МОЙ ГОРОД</p>
            {!editingCity && <p className="font-bold">{(profile && profile.city) || 'Не указан'}</p>}
          </div>
          {!editingCity && (
            <button style={{ background: 'none', color: 'var(--gold)', fontSize: '13px' }}
              onClick={function() { setEditingCity(true) }}>
              Изменить
            </button>
          )}
        </div>
        {editingCity && (
          <div>
            <input value={newCity}
              onChange={function(e) { setNewCity(e.target.value) }}
              placeholder="Введите город"
              className="input mb-8"
            />
            <div className="flex gap-8">
              <button className="btn btn-primary btn-sm" disabled={saving} onClick={saveCity}>
                {saving ? 'Сохраняю...' : 'Сохранить'}
              </button>
              <button className="btn btn-outline btn-sm" onClick={function() { setEditingCity(false) }}>
                Отмена
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="card mb-12">
        <p className="text-gray text-sm mb-4">ТУРНИРЫ</p>
        <p className="font-bold">{history.length}</p>
      </div>

      <div className="card">
        <p className="font-bold mb-12">ИСТОРИЯ ИГР</p>
        {history.length === 0 && <p className="text-gray text-sm">Вы ещё не участвовали в турнирах</p>}
        {history.map(function(h, i) {
          var statusColor = h.status === 'записан' ? 'text-green' : 'text-gold'
          var tournamentDate = h.tournaments ? formatDate(h.tournaments.date) : formatDate(h.created_at)
          return (
            <div key={i} className="flex-between text-sm" style={{ padding: '8px 0', borderBottom: '1px solid #C9A84C11' }}>
              <span>{(h.tournaments && h.tournaments.name) || '\u2014'}</span>
              <span className="text-gray">{tournamentDate}</span>
              <span className={statusColor}>{h.status}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
