export default function ChartTooltip({ active, payload, label, titleFormatter, valueFormatters = {} }) {
  if (!active || !payload || !payload.length) return null
  const title = titleFormatter ? titleFormatter(label, payload) : label
  return (
    <div className="chart-tooltip">
      <div className="tooltip-title">{title}</div>
      {payload.map((entry, index) => {
        const formatter = valueFormatters[entry.dataKey] || ((value) => value)
        return (
          <div className="tooltip-row" key={`${entry.dataKey}-${index}`}>
            <span className="tooltip-key">
              <span
                className="tooltip-swatch"
                style={{ background: entry.color || entry.stroke || '#9ca3af' }}
              />
              {entry.name}
            </span>
            <span className="tooltip-value">{formatter(entry.value, entry)}</span>
          </div>
        )
      })}
    </div>
  )
}
