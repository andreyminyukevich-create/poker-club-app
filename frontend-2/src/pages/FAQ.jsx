import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

var questions = [
  {
    q: 'Как записаться на турнир?',
    a: 'Откройте раздел «Турниры», выберите интересующий турнир и нажмите кнопку «Записаться». Если все места заняты, вы попадёте в лист ожидания.'
  },
  {
    q: 'Что такое лист ожидания?',
    a: 'Если места на турнир закончились, вы можете встать в лист ожидания. Как только кто-то отменит запись, первый в очереди автоматически получит место.'
  },
  {
    q: 'Как работает рейтинг?',
    a: 'Рейтинг начисляется по результатам турниров. Чем выше место — тем больше очков. За нокауты начисляются дополнительные баллы. Рейтинг обновляется после каждого турнира.'
  },
  {
    q: 'Можно ли отменить запись?',
    a: 'Да, откройте страницу турнира и нажмите «Отменить запись». Пожалуйста, делайте это заблаговременно, чтобы другие игроки могли занять ваше место.'
  },
  {
    q: 'Как изменить никнейм?',
    a: 'Зайдите в «Профиль» и нажмите на иконку редактирования рядом с никнеймом. Никнейм должен быть уникальным.'
  },
  {
    q: 'Что такое ноки?',
    a: 'Ноки (нокауты) — это количество игроков, которых вы выбили из турнира. Статистика нокаутов отображается в рейтинге и профиле.'
  },
]

export default function FAQ() {
  var [open, setOpen] = useState(null)
  var navigate = useNavigate()

  function toggle(i) {
    setOpen(open === i ? null : i)
  }

  return (
    <div className="page">
      <button className="text-gold" style={{
        background: 'none', fontSize: '14px', marginBottom: '16px',
        display: 'flex', alignItems: 'center', gap: '6px'
      }} onClick={function() { navigate(-1) }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        Назад
      </button>

      <h1 className="title-display title-xl text-gold mb-16">{"Q&A"}</h1>
      <p className="subtitle mb-24">Часто задаваемые вопросы</p>

      {questions.map(function(item, i) {
        var isOpen = open === i
        return (
          <div key={i} className="card mb-12 cursor-pointer" onClick={function() { toggle(i) }}>
            <div className="flex-between">
              <p style={{ fontSize: '15px', fontWeight: 600, flex: 1, paddingRight: '12px' }}>{item.q}</p>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2"
                style={{ flexShrink: 0, transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
            {isOpen && (
              <p className="text-gray" style={{ fontSize: '14px', lineHeight: 1.7, marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--gold-dim)' }}>
                {item.a}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
