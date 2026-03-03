import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import Tournaments from './pages/Tournaments'
import Rating from './pages/Rating'
import Profile from './pages/Profile'
import TournamentDetail from './pages/TournamentDetail'

const API = import.meta.env.VITE_API_URL

export default function App() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const tg = window.Telegram?.WebApp
    if (tg) {
      tg.expand()
      tg.setBackgroundColor('#1B2D5E')
      const tgUser = tg.initDataUnsafe?.user
      if (tgUser) {
        setUser(tgUser)
        // Регистрируем пользователя и сразу получаем профиль
        fetch(`${API}/api/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tg_id: tgUser.id,
            first_name: tgUser.first_name,
            last_name: tgUser.last_name
          })
        })
          .then(r => r.json())
          .then(data => {
            if (data.ok) setProfile(data.data)
          })
          .catch(console.error)
      }
    }
  }, [])

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
