'use client'

import { useEffect, useState } from 'react'
import { Flame, Users, Clock } from 'lucide-react'

interface ProductUrgencyBarProps {
  inventoryQuantity?: number | null
  lowStockThreshold?: number
}

function getSeededViewers(productHandle: string): number {
  let hash = 0
  for (let i = 0; i < productHandle.length; i++) {
    hash = (hash << 5) - hash + productHandle.charCodeAt(i)
    hash |= 0
  }
  return 12 + (Math.abs(hash) % 24)
}

export default function ProductUrgencyBar({
  inventoryQuantity,
  lowStockThreshold = 15,
}: ProductUrgencyBarProps) {
  const [viewers, setViewers] = useState<number>(0)
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Seed viewer count from current URL to keep consistent per product
    const handle = window.location.pathname.split('/').pop() || 'product'
    const base = getSeededViewers(handle)
    setViewers(base)

    // Fluctuate viewers every 8–14 seconds
    const interval = setInterval(() => {
      setViewers((v) => {
        const delta = Math.floor(Math.random() * 5) - 2
        return Math.max(8, Math.min(base + 12, v + delta))
      })
    }, 10000)

    // Set countdown — resets daily at midnight (sale ends "today")
    const now = new Date()
    const midnight = new Date(now)
    midnight.setHours(23, 59, 59, 999)
    const diffMs = midnight.getTime() - now.getTime()
    const diffH = Math.floor(diffMs / (1000 * 60 * 60))
    const diffM = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    setTimeLeft({ hours: diffH, minutes: diffM })

    return () => clearInterval(interval)
  }, [])

  if (!mounted) return null

  const isLowStock = inventoryQuantity != null && inventoryQuantity > 0 && inventoryQuantity <= lowStockThreshold

  return (
    <div className="space-y-2">
      {/* Active viewers */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: '#c9933a' }} />
            <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: '#c9933a' }} />
          </span>
          <Users className="h-3.5 w-3.5" />
        </div>
        <span>
          <strong className="text-foreground">{viewers} people</strong> viewing this right now
        </span>
      </div>

      {/* Low stock OR sale timer */}
      {isLowStock ? (
        <div className="flex items-center gap-2 text-xs">
          <Flame className="h-3.5 w-3.5 flex-shrink-0" style={{ color: '#c9933a' }} />
          <span>
            <strong className="text-foreground" style={{ color: '#c9933a' }}>
              Only {inventoryQuantity} left
            </strong>
            <span className="text-muted-foreground"> — selling fast at this price</span>
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5 flex-shrink-0" />
          <span>
            Launch pricing ends in{' '}
            <strong className="text-foreground font-mono">
              {String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m
            </strong>
          </span>
        </div>
      )}
    </div>
  )
}
