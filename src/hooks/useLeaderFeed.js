import { useEffect, useState } from 'react'
import { getFeed, startFeedUpdates } from '../lib/api'

export function useLeaderFeed() {
  const [feed, setFeed] = useState(() => getFeed())

  useEffect(() => startFeedUpdates(setFeed), [])

  return feed
}
