export default function EmptyState({ text }) {
  return (
    <div className="text-center" style={{ padding: '40px 0' }}>
      <p className="text-gray">{text || 'Нет данных'}</p>
    </div>
  )
}
