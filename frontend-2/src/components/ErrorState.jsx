export default function ErrorState({ message, onRetry }) {
  return (
    <div className="text-center" style={{ padding: '40px 0' }}>
      <p className="text-gray mb-12">{message || 'Произошла ошибка'}</p>
      {onRetry && (
        <button className="btn btn-outline btn-sm" style={{ display: 'inline-flex' }} onClick={onRetry}>
          Повторить
        </button>
      )}
    </div>
  )
}
