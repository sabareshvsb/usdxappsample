const FEED_KEY = 'usdx_smart_analytics_feed_v1'
const SESSION_KEY = 'usdx_smart_analytics_session_v1'
const EMPTY_KEY = 'usdx_smart_analytics_unavailable_v1'
const listeners = new Set()

const profiles = [
  { id: 'L-101', name: 'Avery Chen', team: 'North Region', base: 1180, scoreBase: 83 },
  { id: 'L-204', name: 'Jordan Lee', team: 'Central Region', base: 980, scoreBase: 79, simulatedUser: true },
  { id: 'L-317', name: 'Meera Iyer', team: 'West Region', base: 880, scoreBase: 76 },
  { id: 'L-422', name: 'Kabir Rao', team: 'East Region', base: 720, scoreBase: 72 },
  { id: 'L-508', name: 'Nisha Verma', team: 'South Region', base: 640, scoreBase: 69 },
  { id: 'L-613', name: 'Rohan Das', team: 'Central Region', base: 520, scoreBase: 65 },
]

function storage() {
  try {
    return typeof window === 'undefined' ? null : window.localStorage
  } catch {
    return null
  }
}

function hash01(input) {
  let hash = 2166136261
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return (hash >>> 0) / 4294967295
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function isoDay(date) {
  return date.toISOString().slice(0, 10)
}

function addDays(date, amount) {
  const next = new Date(date)
  next.setUTCDate(next.getUTCDate() + amount)
  return next
}

function startOfTodayUTC() {
  const now = new Date()
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
}

function sumVolume(points) {
  return points.reduce((total, point) => total + (Number(point.volume) || 0), 0)
}

function buildDaily(profile, end, days = 400) {
  const points = []
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = addDays(end, -offset)
    const dateKey = isoDay(date)
    const index = days - 1 - offset
    const weekdayFactor = [0.82, 1.05, 1.09, 1.04, 1.12, 0.94, 0.74][date.getUTCDay()]
    const trend = 1 + (index / days) * 0.5
    const seasonal = 1 + 0.1 * Math.sin(index / 27)
    const noise = 0.84 + hash01(`${profile.id}:${dateKey}`) * 0.34
    const volume = Math.max(
      0,
      Math.round((profile.base * weekdayFactor * trend * seasonal * noise) / 10) * 10,
    )
    const scoreNoise = (hash01(`score:${profile.id}:${dateKey}`) - 0.5) * 9
    const score = Math.round(clamp(profile.scoreBase + (trend - 1) * 16 + scoreNoise, 0, 100))
    points.push({ date: dateKey, volume, score })
  }
  return points
}

function buildMonthly(daily) {
  const grouped = new Map()
  for (const point of daily) {
    const month = point.date.slice(0, 7)
    const entry = grouped.get(month) || { volume: 0, scoreTotal: 0, count: 0 }
    entry.volume += Number(point.volume) || 0
    entry.scoreTotal += Number(point.score) || 0
    entry.count += 1
    grouped.set(month, entry)
  }
  return Array.from(grouped.entries()).map(([month, entry]) => ({
    month,
    volume: Math.round(entry.volume),
    score: Math.round(entry.scoreTotal / Math.max(1, entry.count)),
    days: entry.count,
  }))
}

function resolveSessionLeaderId(leaders) {
  const store = storage()
  try {
    const stored = store?.getItem(SESSION_KEY)
    if (stored && leaders.some((leader) => leader.id === stored)) return stored
  } catch {}
  const simulated = leaders.find((leader) => leader.simulatedUser) || leaders[0]
  try {
    store?.setItem(SESSION_KEY, simulated.id)
  } catch {}
  return simulated.id
}

function buildFeed() {
  const end = startOfTodayUTC()
  const leaders = profiles.map((profile) => {
    const daily = buildDaily(profile, end)
    return { ...profile, daily, monthly: buildMonthly(daily) }
  })
  const top = [...leaders].sort((a, b) => sumVolume(b.daily) - sumVolume(a.daily))[0]
  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    sessionLeaderId: resolveSessionLeaderId(leaders),
    topLeaderId: top.id,
    leaders,
  }
}

function persist(feed) {
  try {
    storage()?.setItem(FEED_KEY, JSON.stringify(feed))
  } catch {}
}

function emit(feed) {
  listeners.forEach((listener) => listener(feed))
}

export function getFeed() {
  const store = storage()
  try {
    if (store?.getItem(EMPTY_KEY) === '1') return null
  } catch {}
  try {
    const raw = store?.getItem(FEED_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed?.leaders?.length && parsed.sessionLeaderId && parsed.topLeaderId) return parsed
    }
  } catch {}
  const feed = buildFeed()
  persist(feed)
  return feed
}

export function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function startFeedUpdates(listener, intervalMs = 15000) {
  const feed = getFeed()
  if (listener) listener(feed)
  const unsubscribe = listener ? subscribe(listener) : () => {}

  const timer = window.setInterval(() => {
    const current = getFeed()
    if (!current) return
    const today = isoDay(new Date())
    const leaders = current.leaders.map((leader) => {
      const daily = leader.daily.map((point, index) => {
        const isToday = index === leader.daily.length - 1 && point.date === today
        if (!isToday) return point
        const swing = Math.max(20, point.volume * 0.04)
        const volumeDelta = Math.round(((Math.random() - 0.35) * swing) / 10) * 10
        const scoreDelta = Math.round((Math.random() - 0.5) * 4)
        return {
          ...point,
          volume: Math.max(0, point.volume + volumeDelta),
          score: Math.round(clamp(point.score + scoreDelta, 0, 100)),
        }
      })
      return { ...leader, daily, monthly: buildMonthly(daily) }
    })
    const next = {
      ...current,
      generatedAt: new Date().toISOString(),
      leaders,
    }
    persist(next)
    emit(next)
  }, intervalMs)

  return () => {
    window.clearInterval(timer)
    unsubscribe()
  }
}

export function clearFeed() {
  try {
    storage()?.setItem(EMPTY_KEY, '1')
    storage()?.removeItem(FEED_KEY)
  } catch {}
  emit(null)
}

export function restoreFeed() {
  try {
    storage()?.removeItem(EMPTY_KEY)
  } catch {}
  const feed = getFeed()
  emit(feed)
  return feed
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === FEED_KEY || event.key === EMPTY_KEY) emit(getFeed())
  })
}
