export default function ErrorState({ message, onRetry }) {
  return (
    <div className="text-center mt-24">
      <p className="text-danger mb-8">\u26A0\uFE0F {message || '\u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430'}</p>
      {onRetry && (
        <button className="btn btn-outline btn-sm" onClick={onRetry}>
          \u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u044C
        </button>
      )}
    </div>
  )
}
