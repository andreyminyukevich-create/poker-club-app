import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import Tournaments from './pages/Tournaments'
import Rating from './pages/Rating'
import Profile from './pages/Profile'
import TournamentDetail from './pages/TournamentDetail'
import './index.css'

const API = import.meta.env.VITE_API_URL

export default function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const tg = window.Telegram?.WebApp
    if (tg) {
      tg.expand()
      tg.setBackgroundColor('#1B2D5E')
      const tgUser = tg.initDataUnsafe?.user
      if (tgUser) {
        setUser(tgUser)
        fetch(`${API}/api/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tg_id: tgUser.id,
            nickname: tgUser.username,
            first_name: tgUser.first_name,
            last_name: tgUser.last_name
          })
        }).catch(console.error)
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
          <Route path="/profile" element={<Profile user={user} />} />
        </Routes>
      </div>
      <BottomNav />
    </BrowserRouter>
  )
}
