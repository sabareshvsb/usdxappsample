const RANGE_DAYS = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
  '12m': 365,
}

export function rangeDays(range) {
  return RANGE_DAYS[range] || RANGE_DAYS['30d']
}

export function sliceDaily(daily = [], range = '30d') {
  return daily.slice(-rangeDays(range))
}

export function currentMonthDaily(daily = []) {
  const month = daily[daily.length - 1]?.date.slice(0, 7)
  if (!month) return []
  return daily.filter((point) => point.date.startsWith(month))
}

export function sumVolume(points = []) {
  return points.reduce((total, point) => total + (Number(point.volume) || 0), 0)
}

export function growthFrom(first, last) {
  const start = Number(first) || 0
  const end = Number(last) || 0
  if (!start) return 0
  return ((end - start) / start) * 100
}

export function summarizeDaily(points = []) {
  if (!points.length) {
    return { total: 0, highest: null, lowest: null, average: 0, growth: 0, first: null, last: null }
  }
  let highest = points[0]
  let lowest = points[0]
  for (const point of points) {
    if ((Number(point.volume) || 0) > (Number(highest.volume) || 0)) highest = point
    if ((Number(point.volume) || 0) < (Number(lowest.volume) || 0)) lowest = point
  }
  const total = sumVolume(points)
  const first = points[0]
  const last = points[points.length - 1]
  return {
    total,
    highest,
    lowest,
    average: Math.round(total / points.length),
    growth: growthFrom(first.volume, last.volume),
    first,
    last,
  }
}

export function summarizeScores(points = []) {
  const scores = points.map((point) => Number(point.score)).filter(Number.isFinite)
  if (!scores.length) return { highest: 0, current: 0, average: 0, change: 0, delta: 0 }
  const current = scores[scores.length - 1]
  const first = scores[0]
  return {
    highest: Math.max(...scores),
    current,
    average: Math.round(scores.reduce((total, score) => total + score, 0) / scores.length),
    change: growthFrom(first, current),
    delta: current - first,
  }
}

export function selectLeaders(feed) {
  const leaders = feed?.leaders || []
  const me = leaders.find((leader) => leader.id === feed.sessionLeaderId) || leaders[0] || null
  const top = [...leaders].sort((a, b) => sumVolume(b.daily) - sumVolume(a.daily))[0] || null
  return { me, top, leaders }
}

export function monthlyWindow(monthly = [], count = 12) {
  return monthly.slice(-count)
}

export function summarizeMonthly(monthly = [], daily = []) {
  const data = monthlyWindow(monthly, 12)
  if (!data.length) return { total: 0, current: null, previous: null, growth: 0, best: null }
  const current = data[data.length - 1]
  const previous = data.length > 1 ? data[data.length - 2] : null
  const best = data.reduce((winner, point) => (point.volume > winner.volume ? point : winner), data[0])
  let growth = 0
  if (previous) {
    const priorToDate = daily
      .filter((point) => point.date.startsWith(previous.month))
      .slice(0, current.days || daily.length)
    growth = growthFrom(sumVolume(priorToDate) || previous.volume, current.volume)
  }
  return {
    total: sumVolume(data),
    current,
    previous,
    growth,
    best,
  }
}

export function compareLeaders(me, top, range) {
  if (!me || !top) return null
  const myDaily = sliceDaily(me.daily, range)
  const topDaily = sliceDaily(top.daily, range)
  const myMonthly = monthlyWindow(me.monthly, 12)
  const topMonthly = monthlyWindow(top.monthly, 12)
  const mySummary = summarizeDaily(myDaily)
  const topSummary = summarizeDaily(topDaily)
  const myScore = summarizeScores(myDaily)
  const topScore = summarizeScores(topDaily)
  const gap = topSummary.total - mySummary.total
  const leaderTotal = Math.max(topSummary.total, mySummary.total)
  return {
    myDaily,
    topDaily,
    myMonthly,
    topMonthly,
    mySummary,
    topSummary,
    myScore,
    topScore,
    gap,
    gapPercent: leaderTotal ? (Math.abs(gap) / leaderTotal) * 100 : 0,
    progress: leaderTotal ? (Math.min(mySummary.total, topSummary.total) / leaderTotal) * 100 : 0,
  }
}
