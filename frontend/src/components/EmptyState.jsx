export default function EmptyState({ text }) {
  return (
    <div className="text-center mt-24 text-gray">
      {text || '\u041D\u0435\u0442 \u0434\u0430\u043D\u043D\u044B\u0445'}
    </div>
  )
}
