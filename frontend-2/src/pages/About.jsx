import { useNavigate } from 'react-router-dom'
import { IMAGES } from '../config'

export default function About() {
  var navigate = useNavigate()

  return (
    <div>
      <div className="card card-banner" style={{
        backgroundImage: 'url(' + IMAGES.bannerAbout + ')',
        minHeight: '200px', borderRadius: 0, border: 'none'
      }}>
        <div className="card-banner-overlay" style={{ borderRadius: 0 }}></div>
        <div className="card-banner-content">
          <button className="text-gold" style={{
            background: 'none', fontSize: '14px', marginBottom: '16px',
            display: 'flex', alignItems: 'center', gap: '6px'
          }} onClick={function() { navigate(-1) }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            Назад
          </button>
          <h1 className="title-display title-xl">О КЛУБЕ</h1>
        </div>
      </div>

      <div style={{ padding: '16px', paddingBottom: '90px' }}>
        <div className="card mb-12">
          <p className="title-display title-md text-gold mb-12">Московский Покерный Зал</p>
          <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--gray-light)' }}>
            Мы — закрытый покерный клуб для тех, кто ценит качественную игру и хорошую компанию.
            Регулярные турниры, честный рейтинг, дружеская атмосфера.
          </p>
        </div>

        <div className="card mb-12">
          <p className="title-display title-md text-gold mb-12">Как всё устроено</p>
          <div style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--gray-light)' }}>
            <div className="flex mb-12" style={{ gap: '12px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                background: 'var(--gold-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gold)' }}>1</span>
              </div>
              <p>Записывайтесь на турниры через приложение</p>
            </div>
            <div className="flex mb-12" style={{ gap: '12px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                background: 'var(--gold-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gold)' }}>2</span>
              </div>
              <p>Играйте и набирайте очки рейтинга</p>
            </div>
            <div className="flex" style={{ gap: '12px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                background: 'var(--gold-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gold)' }}>3</span>
              </div>
              <p>Следите за рейтингом и зарабатывайте достижения</p>
            </div>
          </div>
        </div>

        <div className="card">
          <p className="title-display title-md text-gold mb-12">Контакты</p>
          <div className="flex" style={{ gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gray)" strokeWidth="2">
              <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
            </svg>
            <span style={{ fontSize: '14px', color: 'var(--gray-light)' }}>Telegram: @poker_club_admin</span>
          </div>
          <div className="flex" style={{ gap: '12px', alignItems: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gray)" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <span style={{ fontSize: '14px', color: 'var(--gray-light)' }}>Москва</span>
          </div>
        </div>
      </div>
    </div>
  )
}
