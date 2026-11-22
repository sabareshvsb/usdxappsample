import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import SectionCard from '../SectionCard'
import Metric from '../Metric'
import ChartTooltip from '../ChartTooltip'
import EmptyState from '../EmptyState'
import { formatCurrency, formatMonth, formatPercent } from '../../lib/format'
import { monthlyWindow, summarizeMonthly } from '../../lib/analytics'

export default function MonthlyVolumeSection({ me }) {
  const data = monthlyWindow(me?.monthly, 12)
  const summary = summarizeMonthly(data, me?.daily)

  return (
    <SectionCard
      index={2}
      title="Monthly Volume"
      subtitle="Rolling 12-month business volume. The current month is highlighted in blue."
      className="card-half"
    >
      {!data.length ? (
        <EmptyState message="No monthly volume records are available for this leader." />
      ) : (
        <>
          <div className="metric-grid">
            <Metric
              label="12-month total"
              value={formatCurrency(summary.total, true)}
              hint={formatCurrency(summary.total)}
              tone="blue"
            />
            <Metric
              label="Current month"
              value={formatCurrency(summary.current.volume, true)}
              hint={formatMonth(summary.current.month)}
              tone="orange"
            />
            <Metric
              label="Monthly growth"
              value={formatPercent(summary.growth)}
              hint={summary.previous ? `MTD vs ${formatMonth(summary.previous.month)}` : 'No prior month'}
              tone={summary.growth >= 0 ? 'green' : 'red'}
            />
            <Metric
              label="Best month"
              value={formatCurrency(summary.best.volume, true)}
              hint={formatMonth(summary.best.month)}
            />
          </div>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="28%">
                <CartesianGrid vertical={false} stroke="#eef0f3" strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickFormatter={formatMonth}
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                  minTickGap={12}
                />
                <YAxis
                  tickFormatter={(value) => formatCurrency(value, true)}
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  tickLine={false}
                  axisLine={false}
                  width={54}
                />
                <Tooltip
                  cursor={{ fill: '#f9fafb' }}
                  content={
                    <ChartTooltip
                      titleFormatter={(label) => formatMonth(label)}
                      valueFormatters={{ volume: (value) => formatCurrency(value) }}
                    />
                  }
                />
                <Bar dataKey="volume" name="Monthly volume" radius={[6, 6, 0, 0]} maxBarSize={42}>
                  {data.map((point, index) => (
                    <Cell
                      key={point.month}
                      fill={index === data.length - 1 ? '#2563eb' : '#cbd5e1'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </SectionCard>
  )
}
