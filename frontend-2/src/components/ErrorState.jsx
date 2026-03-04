export default function ErrorState({ message, onRetry }) {
  return (
    <div className="text-center mt-24">
      <p className="text-danger mb-8">{message || 'Произошла ошибка'}</p>
      {onRetry && (
        <button className="btn btn-outline btn-sm" onClick={onRetry}>
          Повторить
        </button>
      )}
    </div>
  )
}
```

**2. `backend-2/src/services/registrations.js`** — найди строку:
```
.select('*, tournaments(name, date, time)')
```
замени на:
```
.select('*, tournaments!registrations_tournament_id_fk(name, date, time)')
