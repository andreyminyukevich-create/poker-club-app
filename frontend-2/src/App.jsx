import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import Tournaments from './pages/Tournaments'
import Rating from './pages/Rating'
import Profile from './pages/Profile'
import TournamentDetail from './pages/TournamentDetail'
import useTelegram from './hooks/useTelegram'
import { registerMe } from './api/users'

export default function App() {
  var { user } = useTelegram()
  var [profile, setProfile] = useState(null)

  useEffect(function() {
    if (user) {
      registerMe()
        .then(function(result) {
          if (result.ok && result.data) setProfile(result.data)
        })
        .catch(function(err) {
          console.error('Auth error:', err.message)
        })
    }
  }, [user])

  return (
    <BrowserRouter>
      <div style={{ paddingBottom: '70px' }}>
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/tournaments" element={<Tournaments />} />
          <Route path="/tournaments/:id" element={<TournamentDetail user={user} />} />
          <Route path="/rating" element={<Rating />} />
          <Route path="/profile" element={<Profile user={user} profile={profile} setProfile={setProfile} />} />
        </Routes>
      </div>
      <BottomNav />
    </BrowserRouter>
  )
}
