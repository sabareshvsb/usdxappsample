export default function SectionCard({ index, title, subtitle, actions, className = '', children }) {
  return (
    <section className={`card ${className}`}>
      <div className="card-head">
        <div>
          <div className="card-index">{String(index).padStart(2, '0')} / Analytics</div>
          <h2>{title}</h2>
          <p className="card-sub">{subtitle}</p>
        </div>
        {actions ? <div className="card-actions">{actions}</div> : null}
      </div>
      {children}
    </section>
  )
}
