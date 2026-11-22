import { BarChart3 } from 'lucide-react'

export default function EmptyState({
  title = 'No analytics data yet',
  message = 'Volume and score records will appear here as soon as the leader feed is available.',
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <BarChart3 size={20} strokeWidth={1.7} />
      </div>
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  )
}
