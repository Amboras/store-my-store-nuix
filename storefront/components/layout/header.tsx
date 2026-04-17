'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { Search, ShoppingBag, User, Menu, X, LogIn } from 'lucide-react'
import { useCart } from '@/hooks/use-cart'
import { useAuth } from '@/hooks/use-auth'
import CartDrawer from '@/components/cart/cart-drawer'
import { useCollections } from '@/hooks/use-collections'

export default function Header() {
  const { itemCount } = useCart()
  const { isLoggedIn } = useAuth()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { data: collections } = useCollections()

  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const mobileMenuCloseRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isMobileMenuOpen) mobileMenuCloseRef.current?.focus()
  }, [isMobileMenuOpen])

  useEffect(() => {
    if (!isMobileMenuOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isMobileMenuOpen])

  const handleMobileMenuKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !mobileMenuRef.current) return
    const focusable = mobileMenuRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus()
    }
  }, [])

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-[0_1px_0_0_rgba(255,255,255,0.04)]'
            : 'bg-background border-b border-border'
        }`}
      >
        <div className="container-custom">
          <div className="flex h-16 items-center justify-between gap-4">

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 lg:hidden hover:opacity-60 transition-opacity"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Wordmark */}
            <Link href="/" className="flex items-center">
              <span
                className="font-heading font-bold tracking-[0.22em] uppercase text-xl"
                style={{ letterSpacing: '0.22em' }}
              >
                NUIX
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link
                href="/products"
                className="text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors py-1"
                prefetch={true}
              >
                Shop All
              </Link>
              {collections?.slice(0, 4).map((collection: { id: string; handle: string; title: string }) => (
                <Link
                  key={collection.id}
                  href={`/collections/${collection.handle}`}
                  className="text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors py-1"
                  prefetch={true}
                >
                  {collection.title}
                </Link>
              ))}
              <Link
                href="/about"
                className="text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors py-1"
                prefetch={true}
              >
                About
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-0.5">
              <Link
                href="/search"
                className="p-2.5 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Search"
              >
                <Search className="h-4.5 w-4.5" strokeWidth={1.5} />
              </Link>
              <Link
                href={isLoggedIn ? '/account' : '/auth/login'}
                className="p-2.5 text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
                aria-label={isLoggedIn ? 'Account' : 'Sign in'}
              >
                {isLoggedIn
                  ? <User className="h-4.5 w-4.5" strokeWidth={1.5} />
                  : <LogIn className="h-4.5 w-4.5" strokeWidth={1.5} />}
              </Link>
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Shopping bag"
              >
                <ShoppingBag className="h-4.5 w-4.5" strokeWidth={1.5} />
                {itemCount > 0 && (
                  <span
                    className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[9px] font-bold text-black"
                    style={{ backgroundColor: '#c9933a' }}
                  >
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div
            ref={mobileMenuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            onKeyDown={handleMobileMenuKeyDown}
            className="absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-background border-r border-border animate-slide-in-right"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <span className="font-heading font-bold tracking-[0.22em] uppercase text-lg">NUIX</span>
              <button
                ref={mobileMenuCloseRef}
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="px-6 py-6 space-y-1">
              <Link
                href="/products"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-3.5 text-sm tracking-[0.1em] uppercase border-b border-border/40 text-muted-foreground hover:text-foreground transition-colors"
                prefetch={true}
              >
                Shop All
              </Link>
              {collections?.map((collection: { id: string; handle: string; title: string }) => (
                <Link
                  key={collection.id}
                  href={`/collections/${collection.handle}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3.5 text-sm tracking-[0.1em] uppercase border-b border-border/40 text-muted-foreground hover:text-foreground transition-colors"
                  prefetch={true}
                >
                  {collection.title}
                </Link>
              ))}
              <Link
                href="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-3.5 text-sm tracking-[0.1em] uppercase border-b border-border/40 text-muted-foreground hover:text-foreground transition-colors"
                prefetch={true}
              >
                About
              </Link>
              <div className="pt-6 space-y-1">
                <Link
                  href={isLoggedIn ? '/account' : '/auth/login'}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
                >
                  {isLoggedIn ? 'My Account' : 'Sign In'}
                </Link>
                <Link
                  href="/search"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
                >
                  Search
                </Link>
              </div>
            </nav>
            {/* Bottom brand accent */}
            <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: '#c9933a' }} />
          </div>
        </div>
      )}

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
