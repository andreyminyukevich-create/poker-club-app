import { useNavigate, useLocation } from 'react-router-dom'

var HomeIcon = function(p) {
  return <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
}
var TrophyIcon = function(p) {
  return <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 010-5H6"/><path d="M18 9h1.5a2.5 2.5 0 000-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"/><path d="M18 2H6v7a6 6 0 1012 0V2z"/></svg>
}
var StarIcon = function(p) {
  return <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
}
var UserIcon = function(p) {
  return <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
}

var tabs = [
  { path: '/', label: 'Главная', Icon: HomeIcon },
  { path: '/tournaments', label: 'Турниры', Icon: TrophyIcon },
  { path: '/rating', label: 'Рейтинг', Icon: StarIcon },
  { path: '/profile', label: 'Профиль', Icon: UserIcon },
]

export default function BottomNav() {
  var navigate = useNavigate()
  var location = useLocation()

  return (
    <nav className="bottom-nav">
      {tabs.map(function(tab) {
        var active = location.pathname === tab.path || (tab.path !== '/' && location.pathname.startsWith(tab.path))
        if (tab.path === '/') active = location.pathname === '/'
        return (
          <button
            key={tab.path}
            onClick={function() { navigate(tab.path) }}
            className={'nav-item ' + (active ? 'nav-active' : 'nav-inactive')}
          >
            <tab.Icon />
            <span>{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
