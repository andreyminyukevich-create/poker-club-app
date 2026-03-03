import { useNavigate, useLocation } from 'react-router-dom'

var tabs = [
  { path: '/', icon: '\u{1F3E0}', label: '\u0413\u043B\u0430\u0432\u043D\u0430\u044F' },
  { path: '/tournaments', icon: '\u{1F3C6}', label: '\u0422\u0443\u0440\u043D\u0438\u0440\u044B' },
  { path: '/rating', icon: '\u2B50', label: '\u0420\u0435\u0439\u0442\u0438\u043D\u0433' },
  { path: '/profile', icon: '\u{1F464}', label: '\u041F\u0440\u043E\u0444\u0438\u043B\u044C' },
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
            <span style={{ fontSize: '22px' }}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
