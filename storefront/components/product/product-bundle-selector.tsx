'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Package, ArrowRight, Tag } from 'lucide-react'
import { useCart } from '@/hooks/use-cart'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface BundleOffer {
  label: string
  description: string
  savingText: string
  productHandle: string
  variantId?: string
  badgeText?: string
  isBestValue?: boolean
}

interface ProductBundleSelectorProps {
  currentProductTitle: string
  currentVariantId: string | null
  singlePrice: string
  bundleOffers: BundleOffer[]
  currency: string
}

export default function ProductBundleSelector({
  currentProductTitle,
  currentVariantId,
  singlePrice,
  bundleOffers,
  currency,
}: ProductBundleSelectorProps) {
  const [selected, setSelected] = useState<'single' | number>('single')
  const { addItem, isAddingItem } = useCart()
  const [justAdded, setJustAdded] = useState(false)

  const handleContinue = () => {
    if (selected === 'single') {
      // Single item — handled by parent add-to-cart
      return
    }
    const offer = bundleOffers[selected]
    if (!offer) return
    // Navigate to the bundle product page
    window.location.href = `/products/${offer.productHandle}`
  }

  return (
    <div className="border border-border rounded-sm overflow-hidden">
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center gap-2"
        style={{ backgroundColor: 'rgba(201,147,58,0.08)', borderBottom: '1px solid rgba(201,147,58,0.2)' }}
      >
        <Tag className="h-3.5 w-3.5 flex-shrink-0" style={{ color: '#c9933a' }} strokeWidth={2} />
        <p className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: '#c9933a' }}>
          Bundle &amp; Save
        </p>
      </div>

      {/* Single Option */}
      <button
        type="button"
        onClick={() => setSelected('single')}
        className={`w-full flex items-center gap-3 p-4 text-left transition-colors border-b border-border ${
          selected === 'single' ? 'bg-muted/60' : 'hover:bg-muted/30'
        }`}
      >
        {/* Radio */}
        <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
          selected === 'single' ? 'border-foreground' : 'border-border'
        }`}>
          {selected === 'single' && (
            <div className="w-2 h-2 rounded-full bg-foreground" />
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold">Just this piece</p>
          <p className="text-xs text-muted-foreground mt-0.5">{currentProductTitle}</p>
        </div>
        <span className="text-sm font-bold">{singlePrice}</span>
      </button>

      {/* Bundle Options */}
      {bundleOffers.map((offer, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => setSelected(idx)}
          className={`w-full flex items-center gap-3 p-4 text-left transition-colors border-b border-border last:border-b-0 relative ${
            selected === idx ? 'bg-muted/60' : 'hover:bg-muted/30'
          }`}
        >
          {/* Best Value Badge */}
          {offer.isBestValue && (
            <span
              className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 text-black"
              style={{ backgroundColor: '#c9933a' }}
            >
              Best Value
            </span>
          )}
          {/* Radio */}
          <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
            selected === idx ? 'border-foreground' : 'border-border'
          }`}>
            {selected === idx && (
              <div className="w-2 h-2 rounded-full bg-foreground" />
            )}
          </div>
          <div className="flex-1 pr-16">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-semibold">{offer.label}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{offer.description}</p>
            <p className="text-xs font-semibold mt-1" style={{ color: '#c9933a' }}>
              {offer.savingText}
            </p>
          </div>
        </button>
      ))}

      {/* CTA — only shown when a bundle is selected */}
      {selected !== 'single' && (
        <div className="p-4" style={{ borderTop: '1px solid rgba(201,147,58,0.2)' }}>
          <button
            onClick={handleContinue}
            className="w-full flex items-center justify-center gap-2 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-black transition-opacity hover:opacity-85"
            style={{ backgroundColor: '#c9933a' }}
          >
            <Package className="h-4 w-4" />
            Get Bundle Deal
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
          <p className="text-center text-[10px] text-muted-foreground mt-2">
            You&apos;ll be taken to the bundle page to complete your order
          </p>
        </div>
      )}
    </div>
  )
}
