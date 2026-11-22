import { useState } from 'react'
import {
  Area,
  CartesianGrid,
  ComposedChart,
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
import { formatDate, formatMonth, formatNumber, formatPercent } from '../../lib/format'
import { monthlyWindow, sliceDaily, summarizeScores } from '../../lib/analytics'

const MODE_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'monthly', label: 'Monthly' },
]

export default function ScoreSection({ me, range }) {
  const [mode, setMode] = useState('daily')
  const dailyData = sliceDaily(me?.daily, range)
  const monthlyData = monthlyWindow(me?.monthly, 12)
  const data = mode === 'daily' ? dailyData : monthlyData
  const summary = summarizeScores(data)
  const xKey = mode === 'daily' ? 'date' : 'month'
  const color = summary.change >= 0 ? '#059669' : '#dc2626'
  const tickFormatter = mode === 'daily' ? formatDate : formatMonth

  return (
    <SectionCard
      index={3}
      title="Score Performance"
      subtitle="Leader score progression with peak, current and average performance."
      actions={
        <SegmentedControl
          label="Trend"
          options={MODE_OPTIONS}
          value={mode}
          onChange={setMode}
        />
      }
    >
      {!data.length ? (
        <EmptyState message="No leader score history is available for the selected view." />
      ) : (
        <>
          <div className="metric-grid">
            <Metric label="Highest score" value={formatNumber(summary.highest)} hint="Peak in view" tone="green" />
            <Metric label="Current score" value={formatNumber(summary.current)} hint="Latest reading" tone="blue" />
            <Metric label="Average score" value={formatNumber(summary.average)} hint="Across selected data" />
            <Metric
              label="Score change"
              value={formatPercent(summary.change)}
              hint={`${summary.delta >= 0 ? '+' : ''}${formatNumber(summary.delta)} points`}
              tone={summary.change >= 0 ? 'green' : 'red'}
            />
          </div>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={250}>
              <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  tickLine={false}
                  axisLine={false}
                  width={36}
                />
                <Tooltip
                  cursor={{ stroke: '#d1d5db', strokeDasharray: '4 4' }}
                  content={
                    <ChartTooltip
                      titleFormatter={(label) => tickFormatter(label)}
                      valueFormatters={{ score: (value) => formatNumber(value) }}
                    />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  name="Score"
                  stroke={color}
                  strokeWidth={2.5}
                  fill={color}
                  fillOpacity={0.06}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 2, stroke: '#ffffff' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </SectionCard>
  )
}
