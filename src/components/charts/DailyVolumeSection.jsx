import { useState } from 'react'
import {
  Area,
  CartesianGrid,
  ComposedChart,
  ReferenceLine,
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
import { formatCurrency, formatDate, formatPercent } from '../../lib/format'
import { currentMonthDaily, sliceDaily, summarizeDaily } from '../../lib/analytics'

const VIEW_OPTIONS = [
  { value: 'month', label: 'This month' },
  { value: 'range', label: 'Date range' },
]

export default function DailyVolumeSection({ me, range }) {
  const [view, setView] = useState('month')
  const data = view === 'month' ? currentMonthDaily(me?.daily) : sliceDaily(me?.daily, range)
  const summary = summarizeDaily(data)

  return (
    <SectionCard
      index={1}
      title="Daily Volume"
      subtitle="Date-wise business volume for the current month, with daily extremes and total."
      className="card-half"
      actions={
        <SegmentedControl
          label="View"
          options={VIEW_OPTIONS}
          value={view}
          onChange={setView}
        />
      }
    >
      {!data.length ? (
        <EmptyState message="No daily volume records are available for this leader in the selected range." />
      ) : (
        <>
          <div className="metric-grid">
            <Metric
              label="Total volume"
              value={formatCurrency(summary.total)}
              hint={`${data.length} days in view`}
              tone="blue"
            />
            <Metric
              label="Highest day"
              value={formatCurrency(summary.highest.volume)}
              hint={formatDate(summary.highest.date)}
              tone="green"
            />
            <Metric
              label="Lowest day"
              value={formatCurrency(summary.lowest.volume)}
              hint={formatDate(summary.lowest.date)}
              tone="orange"
            />
            <Metric
              label="Daily average"
              value={formatCurrency(summary.average)}
              hint={`${formatPercent(summary.growth)} vs first day`}
              tone={summary.growth >= 0 ? 'green' : 'red'}
            />
          </div>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#eef0f3" strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
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
                      titleFormatter={(label) => formatDate(label)}
                      valueFormatters={{ volume: (value) => formatCurrency(value) }}
                    />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="volume"
                  name="Daily volume"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  fill="#2563eb"
                  fillOpacity={0.07}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 2, stroke: '#ffffff' }}
                />
                <ReferenceLine
                  y={summary.average}
                  stroke="#9ca3af"
                  strokeDasharray="4 4"
                  label={{ value: 'Average', position: 'insideTopRight', fontSize: 10, fill: '#9ca3af' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </SectionCard>
  )
}
