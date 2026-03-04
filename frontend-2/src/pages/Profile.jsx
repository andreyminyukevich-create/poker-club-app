import { useState, useEffect } from 'react'
import { getMe, updateNickname, updateCity } from '../api/users'
import { getMyRegistrations } from '../api/registrations'
import { IMAGES } from '../config'
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
      .catch(function(err) { setError(err.message); setLoading(false) })
  }

  useEffect(load, [user])

  function saveNickname() {
    if (!newNick.trim() || saving) return
    setSaving(true); setNickError('')
    updateNickname(newNick.trim())
      .then(function(res) {
        if (res.ok) {
          setProfile(function(p) { return Object.assign({}, p, { nickname: newNick.trim() }) })
          setEditingNick(false)
        } else { setNickError(res.error || res.message || 'Ошибка') }
        setSaving(false)
      })
      .catch(function(err) { setNickError(err.message || 'Ошибка'); setSaving(false) })
  }

  function saveCity() {
    if (!newCity.trim() || saving) return
    setSaving(true)
    updateCity(newCity.trim())
      .then(function() {
        setProfile(function(p) { return Object.assign({}, p, { city: newCity.trim() }) })
        setEditingCity(false); setSaving(false)
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

  var displayName = (profile && profile.nickname) || user.first_name
  var initials = (displayName || '?').slice(0, 2).toUpperCase()

  return (
    <div className="page">
      <div className="profile-header">
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%',
          border: '2px solid var(--gold)', overflow: 'hidden', flexShrink: 0,
          background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          {user.photo_url
            ? <img src={user.photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--gray)' }}>{initials}</span>
          }
        </div>
        <div>
          <h2 className="profile-name">{displayName}</h2>
          <p className="profile-username">{user.username ? '@' + user.username : ''}</p>
        </div>
      </div>

      <div className="card mb-12">
        <div className="flex-between" style={{ marginBottom: editingCity ? '12px' : '0' }}>
          <div>
            <p className="title-display title-md mb-4">МОЙ ГОРОД</p>
            {!editingCity && <span className="badge">{(profile && profile.city) || 'Не указан'}</span>}
          </div>
          {!editingCity && (
            <button style={{ background: 'none', color: 'var(--gold)', fontSize: '13px' }}
              onClick={function() { setEditingCity(true) }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
          )}
        </div>
        {editingCity && (
          <div>
            <input value={newCity} onChange={function(e) { setNewCity(e.target.value) }}
              placeholder="Введите город" className="input mb-8" />
            <div className="flex gap-8">
              <button className="btn btn-primary btn-sm" disabled={saving} onClick={saveCity}>
                {saving ? '...' : 'Сохранить'}
              </button>
              <button className="btn btn-outline btn-sm" onClick={function() { setEditingCity(false) }}>Отмена</button>
            </div>
          </div>
        )}
      </div>

      <div className="card mb-12">
        <div className="flex-between" style={{ marginBottom: editingNick ? '12px' : '0' }}>
          <div>
            <p className="title-display title-md mb-4">НИКНЕЙМ</p>
            {!editingNick && <p style={{ fontSize: '15px' }}>{(profile && profile.nickname) || '---'}</p>}
          </div>
          {!editingNick && (
            <button style={{ background: 'none', color: 'var(--gold)', fontSize: '13px' }}
              onClick={function() { setEditingNick(true); setNickError('') }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
          )}
        </div>
        {editingNick && (
          <div>
            <input value={newNick}
              onChange={function(e) { setNewNick(e.target.value); setNickError('') }}
              placeholder="Введите никнейм"
              className={'input mb-8 ' + (nickError ? 'input-error' : '')} />
            {nickError && <p className="text-danger text-sm mb-8">{nickError}</p>}
            <div className="flex gap-8">
              <button className="btn btn-primary btn-sm" disabled={saving} onClick={saveNickname}>
                {saving ? '...' : 'Сохранить'}
              </button>
              <button className="btn btn-outline btn-sm" onClick={function() { setEditingNick(false); setNickError('') }}>Отмена</button>
            </div>
          </div>
        )}
      </div>

      <div className="grid-2 mb-12">
        <div className="card">
          <p className="title-display title-md mb-8">МЕДАЛИ</p>
          <span className="badge">0 / 6</span>
        </div>
        <div className="card">
          <p className="title-display title-md mb-8">ДОСТИЖЕНИЯ</p>
          <span className="badge">0 / 27</span>
        </div>
      </div>

      <div className="card card-tournament cursor-pointer">
        <div className="card-info">
          <p className="title-display title-lg mb-4">ИСТОРИЯ ИГР</p>
          <span className="badge">{history.length}</span>
        </div>
        <img className="card-chip" src={IMAGES.chipBlack} alt=""
          style={{ width: '70px', height: '70px', opacity: 0.6 }} />
      </div>

      {history.length > 0 && (
        <div className="card mt-12">
          {history.map(function(h, i) {
            var statusColor = h.status === 'записан' ? 'text-green' : 'text-gold'
            var tournamentDate = h.tournaments ? formatDate(h.tournaments.date) : formatDate(h.created_at)
            return (
              <div key={i} className="flex-between text-sm" style={{ padding: '10px 0', borderBottom: i < history.length - 1 ? '1px solid var(--gold-dim)' : 'none' }}>
                <span style={{ flex: 1 }}>{(h.tournaments && h.tournaments.name) || '---'}</span>
                <span className="text-gray" style={{ marginRight: '12px' }}>{tournamentDate}</span>
                <span className={statusColor}>{h.status}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
