import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'

// Prefetch tournaments before React mounts
var API_URL = import.meta.env.VITE_API_URL || 'https://poker-club-app-production-41ec.up.railway.app'
window.__prefetch_tournaments = fetch(API_URL + '/api/tournaments')
  .then(function(r) { return r.json() })
  .catch(function() { return null })

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
