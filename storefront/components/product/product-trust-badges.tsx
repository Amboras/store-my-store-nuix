import { ShieldCheck, RotateCcw, Truck, Lock, Award, Zap } from 'lucide-react'

const BADGES = [
  {
    icon: ShieldCheck,
    label: '30-Day Guarantee',
    sub: 'Full refund, no questions',
  },
  {
    icon: RotateCcw,
    label: 'Free Returns',
    sub: 'Hassle-free policy',
  },
  {
    icon: Truck,
    label: 'Tracked Shipping',
    sub: 'Real-time updates',
  },
  {
    icon: Lock,
    label: 'Secure Checkout',
    sub: '256-bit SSL encrypted',
  },
  {
    icon: Award,
    label: 'Premium Quality',
    sub: 'DTG & screen-print',
  },
  {
    icon: Zap,
    label: 'Made to Order',
    sub: 'Zero waste model',
  },
]

export default function ProductTrustBadges() {
  return (
    <div className="border border-border rounded-sm p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4 text-center">
        You&apos;re Protected
      </p>
      <div className="grid grid-cols-3 gap-3">
        {BADGES.map(({ icon: Icon, label, sub }) => (
          <div key={label} className="flex flex-col items-center text-center gap-1.5">
            <div
              className="w-9 h-9 flex items-center justify-center rounded-sm"
              style={{ backgroundColor: 'rgba(201,147,58,0.08)' }}
            >
              <Icon className="h-4 w-4" style={{ color: '#c9933a' }} strokeWidth={1.5} />
            </div>
            <p className="text-[10px] font-semibold leading-tight">{label}</p>
            <p className="text-[9px] text-muted-foreground leading-tight">{sub}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
