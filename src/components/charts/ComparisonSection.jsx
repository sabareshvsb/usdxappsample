import { useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import SectionCard from '../SectionCard'
import Metric from '../Metric'
import SegmentedControl from '../SegmentedControl'
import ChartTooltip from '../ChartTooltip'
import EmptyState from '../EmptyState'
import { formatCurrency, formatDate, formatMonth, formatNumber, formatPercent } from '../../lib/format'
import { compareLeaders } from '../../lib/analytics'

const MODE_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'monthly', label: 'Monthly' },
]

function Legend() {
  return (
    <div className="legend">
      <span className="legend-item">
        <span className="legend-line" style={{ background: '#2563eb' }} />
        MY PERFORMANCE
      </span>
      <span className="legend-item">
        <span className="legend-line" style={{ background: '#d97706' }} />
        TOP LEADER
      </span>
    </div>
  )
}

export default function ComparisonSection({ me, top, range }) {
  const [mode, setMode] = useState('daily')
  const comparison = compareLeaders(me, top, range)

  if (!comparison) {
    return (
      <SectionCard
        index={4}
        title="Personal vs Top Leader"
        subtitle="A focused comparison of volume, score, growth and performance gap."
      >
        <EmptyState message="Comparison data needs both a current leader and a ranked top leader." />
      </SectionCard>
    )
  }

  const mySeries = mode === 'daily' ? comparison.myDaily : comparison.myMonthly
  const topSeries = mode === 'daily' ? comparison.topDaily : comparison.topMonthly
  const xKey = mode === 'daily' ? 'date' : 'month'
  const tickFormatter = mode === 'daily' ? formatDate : formatMonth
  const series = mySeries.map((point, index) => ({
    [xKey]: point[xKey],
    me: point.volume,
    top: topSeries[index]?.volume ?? null,
    myScore: point.score,
    topScore: topSeries[index]?.score ?? null,
  }))
  const monthlySeries = comparison.myMonthly.map((point, index) => ({
    month: point.month,
    me: point.volume,
    top: comparison.topMonthly[index]?.volume ?? null,
  }))
  const gapText =
    comparison.gap > 0
      ? `${top.name} ahead`
      : comparison.gap < 0
        ? 'You are ahead'
        : 'Level performance'

  return (
    <SectionCard
      index={4}
      title="Personal vs Top Leader"
      subtitle={`My Performance against ${top.name} — the highest-ranked leader in the current feed.`}
      actions={
        <SegmentedControl
          label="Compare"
          options={MODE_OPTIONS}
          value={mode}
          onChange={setMode}
        />
      }
    >
      <div className="metric-grid">
        <Metric
          label="Total volume"
          value={`${formatCurrency(comparison.mySummary.total, true)} / ${formatCurrency(comparison.topSummary.total, true)}`}
          hint={gapText}
          tone="blue"
        />
        <Metric
          label="Score"
          value={`${comparison.myScore.current} / ${comparison.topScore.current}`}
          hint={`${formatNumber(comparison.myScore.delta)} vs ${formatNumber(comparison.topScore.delta)} pts`}
        />
        <Metric
          label="Growth"
          value={`${formatPercent(comparison.mySummary.growth)} / ${formatPercent(comparison.topSummary.growth)}`}
          hint={`${formatPercent(comparison.mySummary.growth - comparison.topSummary.growth)} relative gap`}
          tone={comparison.mySummary.growth >= comparison.topSummary.growth ? 'green' : 'red'}
        />
        <Metric
          label="Performance gap"
          value={formatCurrency(Math.abs(comparison.gap))}
          hint={`${formatPercent(comparison.gapPercent)} gap · ${Math.round(comparison.progress)}% progress`}
          tone={comparison.gap <= 0 ? 'green' : 'orange'}
        />
      </div>

      <div className="comparison-charts">
        <div className="chart-block full">
          <div className="chart-block-title">Business volume comparison</div>
          <div className="chart-block-sub">
            {mode === 'daily' ? 'Daily performance over the selected range' : 'Monthly performance over 12 months'}
          </div>
          <Legend />
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={series} margin={{ top: 12, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#eef0f3" strokeDasharray="3 3" />
              <XAxis
                dataKey={xKey}
                tickFormatter={tickFormatter}
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
                minTickGap={24}
              />
              <YAxis
                tickFormatter={(value) => formatCurrency(value, true)}
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                tickLine={false}
                axisLine={false}
                width={54}
              />
              <Tooltip
                cursor={{ stroke: '#d1d5db', strokeDasharray: '4 4' }}
                content={
                  <ChartTooltip
                    titleFormatter={(label) => tickFormatter(label)}
                    valueFormatters={{
                      me: (value) => formatCurrency(value),
                      top: (value) => formatCurrency(value),
                    }}
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="me"
                name="MY PERFORMANCE"
                stroke="#2563eb"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2, stroke: '#ffffff' }}
              />
              <Line
                type="monotone"
                dataKey="top"
                name="TOP LEADER"
                stroke="#d97706"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2, stroke: '#ffffff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-block">
          <div className="chart-block-title">Monthly volume</div>
          <div className="chart-block-sub">Grouped comparison · rolling 12 months</div>
          <Legend />
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={monthlySeries} margin={{ top: 12, right: 8, left: 0, bottom: 0 }} barGap={3}>
              <CartesianGrid vertical={false} stroke="#eef0f3" strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickFormatter={formatMonth}
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
                minTickGap={12}
              />
              <YAxis
                tickFormatter={(value) => formatCurrency(value, true)}
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                tickLine={false}
                axisLine={false}
                width={48}
              />
              <Tooltip
                cursor={{ fill: '#f9fafb' }}
                content={
                  <ChartTooltip
                    titleFormatter={(label) => formatMonth(label)}
                    valueFormatters={{
                      me: (value) => formatCurrency(value),
                      top: (value) => formatCurrency(value),
                    }}
                  />
                }
              />
              <Bar dataKey="me" name="MY PERFORMANCE" fill="#2563eb" radius={[4, 4, 0, 0]} maxBarSize={18} />
              <Bar dataKey="top" name="TOP LEADER" fill="#d97706" radius={[4, 4, 0, 0]} maxBarSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-block">
          <div className="chart-block-title">Comparative score</div>
          <div className="chart-block-sub">
            {mode === 'daily' ? 'Daily score movement' : 'Monthly average score'}
          </div>
          <Legend />
          <ResponsiveContainer width="100%" height={210}>
            <LineChart data={series} margin={{ top: 12, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#eef0f3" strokeDasharray="3 3" />
              <XAxis
                dataKey={xKey}
                tickFormatter={tickFormatter}
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
                minTickGap={18}
              />
              <YAxis
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                tickLine={false}
                axisLine={false}
                width={36}
              />
              <Tooltip
                cursor={{ stroke: '#d1d5db', strokeDasharray: '4 4' }}
                content={
                  <ChartTooltip
                    titleFormatter={(label) => tickFormatter(label)}
                    valueFormatters={{
                      myScore: (value) => formatNumber(value),
                      topScore: (value) => formatNumber(value),
                    }}
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="myScore"
                name="MY PERFORMANCE"
                stroke="#2563eb"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2, stroke: '#ffffff' }}
              />
              <Line
                type="monotone"
                dataKey="topScore"
                name="TOP LEADER"
                stroke="#d97706"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2, stroke: '#ffffff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </SectionCard>
  )
}
