export function formatCurrency(value, compact = false) {
  if (!Number.isFinite(Number(value))) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits: compact ? 1 : 0,
  }).format(Number(value))
}

export function formatNumber(value) {
  if (!Number.isFinite(Number(value))) return '—'
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Number(value))
}

export function formatPercent(value, signed = true) {
  if (!Number.isFinite(Number(value))) return '—'
  const number = Number(value)
  const prefix = signed && number > 0 ? '+' : ''
  return `${prefix}${number.toFixed(1)}%`
}

export function formatDate(iso) {
  if (!iso) return '—'
  const date = new Date(`${iso}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) return String(iso)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

export function formatMonth(month) {
  if (!month) return '—'
  const date = new Date(`${month}-01T00:00:00Z`)
  if (Number.isNaN(date.getTime())) return String(month)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: '2-digit',
    timeZone: 'UTC',
  }).format(date)
}

export function formatTime(iso) {
  if (!iso) return '—'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}
