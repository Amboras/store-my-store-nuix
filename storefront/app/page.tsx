'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import {
  ArrowRight,
  Truck,
  Shield,
  RotateCcw,
  Zap,
  Globe,
  Package,
  Star,
} from 'lucide-react'
import CollectionSection from '@/components/marketing/collection-section'
import { useCollections } from '@/hooks/use-collections'
import { trackMetaEvent } from '@/lib/meta-pixel'

// Validated Unsplash editorial images
const HERO_IMG     = 'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=1600&q=85&fit=crop'
const LIFESTYLE_1  = 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=1600&q=85&fit=crop'
const LIFESTYLE_2  = 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1400&q=85&fit=crop'
const LIFESTYLE_3  = 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1200&q=85&fit=crop'
const LIFESTYLE_4  = 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=1200&q=85&fit=crop'

const FEATURES = [
  {
    icon: Package,
    title: 'Print-On-Demand',
    desc: 'Every piece made to order. Zero waste, maximum quality.',
  },
  {
    icon: Globe,
    title: 'Ships Worldwide',
    desc: 'North America, Europe & beyond. Multi-currency checkout.',
  },
  {
    icon: Zap,
    title: 'Limited Drops',
    desc: 'Designs retire. Own them before they\'re gone forever.',
  },
  {
    icon: Shield,
    title: 'Satisfaction Guarantee',
    desc: '30-day hassle-free returns. Quality you can trust.',
  },
]

const EDITORIAL_STATS = [
  { value: '96K+', label: 'Designs in Catalog' },
  { value: '40+', label: 'Countries Shipped' },
  { value: '100%', label: 'Print-On-Demand' },
  { value: '5', label: 'Currencies Supported' },
]

export default function HomePage() {
  const { data: collections, isLoading } = useCollections()
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsletterEmail.trim()) return
    trackMetaEvent('Lead', {
      content_name: 'newsletter_signup',
      status: 'submitted',
    })
    setSubmitted(true)
  }

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-background">
        {/* Full-bleed background image with dark overlay */}
        <div className="absolute inset-0">
          <Image
            src={HERO_IMG}
            alt="NUIX — Premium Graphic Apparel"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative container-custom py-20">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6 animate-fade-in">
              <div className="h-px w-8" style={{ backgroundColor: '#c9933a' }} />
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                New Season Collection
              </p>
            </div>

            <h1
              className="font-heading font-bold leading-[1.0] tracking-tight mb-6 animate-fade-in-up text-foreground"
              style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', letterSpacing: '-0.03em' }}
            >
              Wear What
              <br />
              <span style={{
                background: 'linear-gradient(135deg, #c9933a 0%, #e8c07a 50%, #c9933a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Defines You.
              </span>
            </h1>

            <p className="text-base text-muted-foreground leading-relaxed max-w-md mb-10 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
              Luxury editorial streetwear. Premium graphic apparel crafted for the
              few who shape culture — not those who follow it.
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
              <Link
                href="/products"
                className="inline-flex items-center gap-2.5 px-8 py-4 text-xs font-bold uppercase tracking-[0.18em] bg-foreground text-background hover:opacity-85 transition-opacity"
                prefetch={true}
              >
                Shop Collection
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2.5 border border-border px-8 py-4 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
                prefetch={true}
              >
                Our Story
              </Link>
            </div>
          </div>
        </div>

        {/* Floating scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40">
          <div className="w-px h-8 bg-foreground" />
          <p className="text-[9px] uppercase tracking-[0.3em]">Scroll</p>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────── */}
      <section className="border-y border-border bg-background" style={{ borderTopColor: '#c9933a22' }}>
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-border">
            {EDITORIAL_STATS.map(({ value, label }) => (
              <div key={label} className="py-8 px-6 text-center">
                <p className="font-heading font-bold text-2xl text-foreground" style={{ letterSpacing: '-0.02em' }}>
                  {value}
                </p>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COLLECTIONS ───────────────────────────────────────── */}
      {isLoading ? (
        <section className="py-section">
          <div className="container-custom">
            <div className="animate-pulse space-y-3 mb-12">
              <div className="h-2 w-16 bg-muted rounded mx-auto" />
              <div className="h-8 w-56 bg-muted rounded mx-auto" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-[3/4] bg-muted animate-pulse" />
              ))}
            </div>
          </div>
        </section>
      ) : collections && collections.length > 0 ? (
        <>
          {collections.map((collection: { id: string; handle: string; title: string; metadata?: Record<string, unknown> }, index: number) => (
            <CollectionSection
              key={collection.id}
              collection={collection}
              alternate={index % 2 === 1}
            />
          ))}
        </>
      ) : null}

      {/* ── EDITORIAL GRID — Brand Story ─────────────────────── */}
      <section className="py-section bg-background">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image collage */}
            <div className="grid grid-cols-2 gap-3">
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={LIFESTYLE_1}
                  alt="NUIX — Editorial streetwear"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-[3/4] overflow-hidden mt-8">
                <Image
                  src={LIFESTYLE_2}
                  alt="NUIX — Premium graphic apparel"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-square overflow-hidden col-span-2">
                <Image
                  src={LIFESTYLE_3}
                  alt="NUIX — Culture-defining apparel"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Text */}
            <div className="lg:max-w-md space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-px w-6" style={{ backgroundColor: '#c9933a' }} />
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                  The NUIX Philosophy
                </p>
              </div>
              <h2
                className="font-heading font-bold leading-tight"
                style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', letterSpacing: '-0.02em' }}
              >
                Not Manufactured.
                <br />
                <span className="text-muted-foreground font-normal">Created.</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                NUIX is built on the conviction that fashion should be intentional.
                Every graphic is a statement. Every drop is deliberate. We source
                the finest print-on-demand suppliers so each garment arrives with
                the weight of something worth wearing.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                With over 96,000 designs across North America and Europe, the catalog
                is vast — but every piece feels singular.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] hover:opacity-70 transition-opacity"
                prefetch={true}
              >
                Read the Full Story
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── LIFESTYLE FULL-BLEED BANNER ───────────────────────── */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <Image
          src={LIFESTYLE_4}
          alt="NUIX — Wear what defines you"
          fill
          sizes="100vw"
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-4">
            Limited Availability
          </p>
          <h2
            className="font-heading font-bold text-foreground leading-tight mb-6"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.025em' }}
          >
            Every Drop Retires.
            <br />Own It While It Lasts.
          </h2>
          <Link
            href="/products"
            className="inline-flex items-center gap-2.5 px-8 py-4 text-xs font-bold uppercase tracking-[0.18em] text-background"
            style={{ backgroundColor: '#c9933a' }}
            prefetch={true}
          >
            Browse All Drops
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* ── FEATURE PILLARS ───────────────────────────────────── */}
      <section className="py-section bg-background border-y border-border">
        <div className="container-custom">
          <div className="text-center mb-14">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground mb-3">Why NUIX</p>
            <h2
              className="font-heading font-bold"
              style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', letterSpacing: '-0.02em' }}
            >
              Built Different
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group">
                <div
                  className="w-10 h-10 flex items-center justify-center border border-border mb-5 transition-colors group-hover:border-[#c9933a]"
                >
                  <Icon className="h-4.5 w-4.5 text-muted-foreground group-hover:text-[#c9933a] transition-colors" strokeWidth={1.5} />
                </div>
                <h3 className="font-heading font-semibold text-sm uppercase tracking-wider mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST SIGNALS STRIP ───────────────────────────────── */}
      <section className="py-section-sm border-b border-border">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <Truck className="h-5 w-5 flex-shrink-0 text-muted-foreground" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-semibold">Free Shipping</p>
                <p className="text-xs text-muted-foreground">On orders over $150 CAD / $110 USD</p>
              </div>
            </div>
            <div className="flex items-center gap-4 md:justify-center">
              <RotateCcw className="h-5 w-5 flex-shrink-0 text-muted-foreground" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-semibold">30-Day Returns</p>
                <p className="text-xs text-muted-foreground">No questions asked</p>
              </div>
            </div>
            <div className="flex items-center gap-4 md:justify-end">
              <Star className="h-5 w-5 flex-shrink-0 text-muted-foreground" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-semibold">Premium Print Quality</p>
                <p className="text-xs text-muted-foreground">Multiple supplier network</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ────────────────────────────────────────── */}
      <section className="py-section bg-background">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-6" style={{ backgroundColor: '#c9933a' }} />
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                Inner Circle
              </p>
              <div className="h-px w-6" style={{ backgroundColor: '#c9933a' }} />
            </div>
            <h2
              className="font-heading font-bold mb-4"
              style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', letterSpacing: '-0.02em' }}
            >
              First Access. Always.
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Join the NUIX inner circle. Get early access to new drops,
              exclusive offers, and editorial content — before anyone else.
            </p>
            {submitted ? (
              <div className="flex items-center justify-center gap-2 text-sm font-semibold" style={{ color: '#c9933a' }}>
                <Shield className="h-4 w-4" />
                You&apos;re in. Welcome to NUIX.
              </div>
            ) : (
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={handleNewsletterSubmit}>
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 bg-muted border border-border px-4 py-3.5 text-sm placeholder:text-muted-foreground focus:border-foreground/40 focus:outline-none transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-background hover:opacity-85 transition-opacity whitespace-nowrap"
                  style={{ backgroundColor: '#c9933a' }}
                >
                  Join Now
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
