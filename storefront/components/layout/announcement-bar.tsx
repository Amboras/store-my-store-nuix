'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

const MESSAGES = [
  'Free worldwide shipping on orders over $150 CAD',
  'New drop: Limited edition graphic tees — sizes selling fast',
  'Print-on-demand — every piece made to order',
  'Multi-currency checkout: CAD · USD · EUR · SEK',
]

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  const repeated = [...MESSAGES, ...MESSAGES]

  return (
    <div className="relative overflow-hidden" style={{ backgroundColor: '#c9933a' }}>
      <div className="flex items-center justify-between py-2.5">
        <div className="flex-1 overflow-hidden">
          <div className="marquee-track">
            {repeated.map((msg, i) => (
              <span
                key={i}
                className="text-xs font-bold uppercase tracking-[0.18em] text-black px-10 whitespace-nowrap"
              >
                {msg}
                <span className="mx-8 opacity-40">&#x2014;</span>
              </span>
            ))}
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-3 p-1 text-black/70 hover:text-black transition-colors z-10"
          aria-label="Dismiss announcement"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
