'use client'

import Link from 'next/link'
import { Camera, Share2, PlayCircle } from 'lucide-react'
import { clearConsent } from '@/lib/cookie-consent'
import { usePolicies } from '@/hooks/use-policies'

const footerLinks = {
  shop: [
    { label: 'All Products', href: '/products' },
    { label: 'New Arrivals', href: '/products?sort=newest' },
    { label: 'Collections', href: '/collections' },
    { label: 'Graphic Tees', href: '/collections' },
  ],
  help: [
    { label: 'FAQ', href: '/faq' },
    { label: 'Shipping & Returns', href: '/shipping' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Track Order', href: '/account/orders' },
  ],
}

const socialLinks = [
  { label: 'Instagram', href: '#', icon: Camera },
  { label: 'X / Twitter', href: '#', icon: Share2 },
  { label: 'YouTube', href: '#', icon: PlayCircle },
]

export default function Footer() {
  const { policies } = usePolicies()

  const companyLinks = [
    { label: 'About', href: '/about' },
  ]
  if (policies?.privacy_policy)   companyLinks.push({ label: 'Privacy Policy', href: '/privacy' })
  if (policies?.terms_of_service) companyLinks.push({ label: 'Terms of Service', href: '/terms' })
  if (policies?.refund_policy)    companyLinks.push({ label: 'Refund Policy', href: '/refund-policy' })
  if (policies?.cookie_policy)    companyLinks.push({ label: 'Cookie Policy', href: '/cookie-policy' })

  return (
    <footer className="border-t border-border bg-background">
      {/* Gold accent line */}
      <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, #c9933a 40%, transparent)' }} />

      <div className="container-custom py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <span className="font-heading font-bold tracking-[0.22em] uppercase text-2xl">NUIX</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mb-6">
              Premium graphic apparel and streetwear with a luxury editorial aesthetic.
              Every piece crafted on demand — made for the few who define culture.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-4">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors border border-border hover:border-foreground/30 rounded-sm"
                >
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-5">Shop</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-5">Help</h3>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-5">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Currencies / Markets badge strip */}
        <div className="mt-12 flex flex-wrap gap-2">
          {['USD', 'CAD', 'EUR', 'SEK', 'RON'].map((cur) => (
            <span
              key={cur}
              className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 border border-border text-muted-foreground rounded-sm"
            >
              {cur}
            </span>
          ))}
          <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 border border-border text-muted-foreground rounded-sm">
            North America
          </span>
          <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 border border-border text-muted-foreground rounded-sm">
            Europe
          </span>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} NUIX. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                clearConsent()
                window.dispatchEvent(new Event('manage-cookies'))
              }}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Manage Cookies
            </button>
            <span className="text-xs text-muted-foreground">Powered by Amboras</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
