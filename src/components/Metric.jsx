export default function Metric({ label, value, hint, tone = '' }) {
  return (
    <div className="metric">
      <div className="metric-label">{label}</div>
      <div className={`metric-value ${tone}`}>{value}</div>
      {hint ? <div className="metric-hint">{hint}</div> : null}
    </div>
  )
}
