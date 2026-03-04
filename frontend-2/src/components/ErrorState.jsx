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
