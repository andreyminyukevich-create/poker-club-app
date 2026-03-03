import { useNavigate, useLocation } from 'react-router-dom'

var tabs = [
  { path: '/', label: 'Главная' },
  { path: '/tournaments', label: 'Турниры' },
  { path: '/rating', label: 'Рейтинг' },
  { path: '/profile', label: 'Профиль' },
]

export default function BottomNav() {
  var navigate = useNavigate()
  var location = useLocation()

  return (
    <nav className="bottom-nav">
      {tabs.map(function(tab) {
        var active = location.pathname === tab.path
        return (
          <button
            key={tab.path}
            onClick={function() { navigate(tab.path) }}
            className={'nav-item ' + (active ? 'nav-active' : 'nav-inactive')}
          >
            <span>{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
