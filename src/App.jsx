import { useState } from 'react'
import SegmentedControl from './components/SegmentedControl'
import DailyVolumeSection from './components/charts/DailyVolumeSection'
import MonthlyVolumeSection from './components/charts/MonthlyVolumeSection'
import ScoreSection from './components/charts/ScoreSection'
import ComparisonSection from './components/charts/ComparisonSection'
import { useLeaderFeed } from './hooks/useLeaderFeed'
import { selectLeaders } from './lib/analytics'
import { formatTime } from './lib/format'

const RANGE_OPTIONS = [
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: '90d', label: '90 days' },
  { value: '12m', label: '12 months' },
]

export default function App() {
  const [range, setRange] = useState('30d')
  const feed = useLeaderFeed()
  const { me, top } = selectLeaders(feed)

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="container topbar-row">
          <div>
            <div className="brand-line">
              <span className="brand-mark">US</span>
              <span className="eyebrow">USDX-SMART · Leaders Analytics</span>
            </div>
            <h1>Leaders Analytics</h1>
            <p className="subtitle">
              Four focused views of business volume, score progression and the performance gap
              between My Performance and the highest-ranked leader.
            </p>
          </div>
          <div className="topbar-controls">
            <div className="control-group">
              <span className="control-label">Date range</span>
              <SegmentedControl options={RANGE_OPTIONS} value={range} onChange={setRange} />
            </div>
            <div className="live-wrap">
              <div className="live-badge">
                <span
                  className={feed ? 'live-dot' : 'tooltip-swatch'}
                  style={!feed ? { background: '#9ca3af' } : undefined}
                />
                {feed ? 'Live simulated feed' : 'Feed unavailable'}
              </div>
              <span className="updated">
                {feed ? `Updated ${formatTime(feed.generatedAt)}` : 'Waiting for data source'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="container dashboard-grid">
        <DailyVolumeSection me={me} range={range} />
        <MonthlyVolumeSection me={me} />
        <ScoreSection me={me} range={range} />
        <ComparisonSection me={me} top={top} range={range} />
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <span>Demo environment · simulated leader feed</span>
          <span>USDX-SMART · Inter analytics</span>
        </div>
      </footer>
    </div>
  )
}
