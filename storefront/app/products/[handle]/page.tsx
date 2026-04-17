import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const revalidate = 3600
import { medusaServerClient } from '@/lib/medusa-client'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import ProductActions from '@/components/product/product-actions'
import ProductAccordion from '@/components/product/product-accordion'
import { ProductViewTracker } from '@/components/product/product-view-tracker'
import ProductBundleSelector from '@/components/product/product-bundle-selector'
import ProductUrgencyBar from '@/components/product/product-urgency-bar'
import ProductTrustBadges from '@/components/product/product-trust-badges'
import { getProductPlaceholder } from '@/lib/utils/placeholder-images'
import { type VariantExtension } from '@/components/product/product-price'

async function getProduct(handle: string) {
  try {
    const regionsResponse = await medusaServerClient.store.region.list()
    const regionId = regionsResponse.regions[0]?.id
    if (!regionId) throw new Error('No region found')

    const response = await medusaServerClient.store.product.list({
      handle,
      region_id: regionId,
      fields: '*variants.calculated_price',
    })
    return response.products?.[0] || null
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

async function getVariantExtensions(productId: string): Promise<Record<string, VariantExtension>> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
    const storeId = process.env.NEXT_PUBLIC_STORE_ID
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
    const headers: Record<string, string> = {}
    if (storeId) headers['X-Store-Environment-ID'] = storeId
    if (publishableKey) headers['x-publishable-api-key'] = publishableKey

    const res = await fetch(
      `${baseUrl}/store/product-extensions/products/${productId}/variants`,
      { headers, next: { revalidate: 30 } },
    )
    if (!res.ok) return {}

    const data = await res.json()
    const map: Record<string, VariantExtension> = {}
    for (const v of data.variants || []) {
      map[v.id] = {
        compare_at_price: v.compare_at_price,
        allow_backorder: v.allow_backorder ?? false,
        inventory_quantity: v.inventory_quantity,
      }
    }
    return map
  } catch {
    return {}
  }
}

function formatPrice(amountCents: number | null | undefined, currency: string): string {
  if (amountCents == null) return ''
  const amount = amountCents / 100
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>
}): Promise<Metadata> {
  const { handle } = await params
  const product = await getProduct(handle)
  if (!product) return { title: 'Product Not Found' }

  return {
    title: product.title,
    description: product.description
      ? product.description.replace(/<[^>]+>/g, '').slice(0, 155)
      : `Shop ${product.title} — NUIX Premium Apparel`,
    openGraph: {
      title: `${product.title} | NUIX`,
      description: product.description
        ? product.description.replace(/<[^>]+>/g, '').slice(0, 155)
        : `Shop ${product.title}`,
      ...(product.thumbnail ? { images: [{ url: product.thumbnail }] } : {}),
    },
  }
}

// Determine if this product is a tee (show hoodie bundle offer) or hoodie (show tee bundle offer)
function getBundleOffers(productHandle: string) {
  const isTee = productHandle.includes('tee') || productHandle.includes('graphic')
  const isHoodie = productHandle.includes('hoodie') || productHandle.includes('phantom')

  if (isTee) {
    return [
      {
        label: 'Tee + Hoodie Bundle',
        description: 'Add the NUIX Phantom Hoodie and save $25',
        savingText: 'Save $25 USD — Best pairing in the catalog',
        productHandle: 'nuix-founders-bundle-tee-hoodie',
        isBestValue: true,
        badgeText: 'Most Popular',
      },
    ]
  }
  if (isHoodie) {
    return [
      {
        label: 'Hoodie + Tee Bundle',
        description: 'Add the NUIX Void Tee and save $25',
        savingText: 'Save $25 USD — Curated by NUIX',
        productHandle: 'nuix-founders-bundle-tee-hoodie',
        isBestValue: true,
        badgeText: 'Most Popular',
      },
    ]
  }
  return []
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params
  const product = await getProduct(handle)
  if (!product) notFound()

  const variantExtensions = await getVariantExtensions(product.id)

  const allImages = [
    ...(product.thumbnail ? [{ url: product.thumbnail }] : []),
    ...(product.images || []).filter((img: { url: string }) => img.url !== product.thumbnail),
  ]
  const displayImages = allImages.length > 0 ? allImages : [{ url: getProductPlaceholder(product.id) }]

  const firstVariant = product.variants?.[0]
  const firstVariantExt = firstVariant?.id ? variantExtensions[firstVariant.id] : null
  const priceAmount = firstVariant?.calculated_price?.calculated_amount
  const currency = firstVariant?.calculated_price?.currency_code || 'cad'
  const singlePriceFormatted = formatPrice(priceAmount, currency)

  const bundleOffers = getBundleOffers(handle)
  const isBundle = handle.includes('bundle')

  // Total inventory across all variants for urgency signal
  const totalInventory = Object.values(variantExtensions).reduce(
    (acc, v) => acc + (v.inventory_quantity ?? 0),
    0,
  )
  const hasInventoryData = Object.keys(variantExtensions).length > 0

  return (
    <>
      {/* Breadcrumbs */}
      <div className="border-b border-border">
        <div className="container-custom py-3">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/products" className="hover:text-foreground transition-colors">Shop</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground truncate max-w-[200px]">{product.title}</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-8 lg:py-14">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20">

          {/* ── LEFT: Product Images ───────────────────────── */}
          <div className="space-y-3">
            {/* Main image */}
            <div className="relative aspect-[4/5] overflow-hidden bg-muted">
              <Image
                src={displayImages[0].url}
                alt={product.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              {isBundle && (
                <div
                  className="absolute top-4 left-4 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-black"
                  style={{ backgroundColor: '#c9933a' }}
                >
                  Bundle Deal
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {displayImages.length > 1 && (
              <div className={`grid gap-3 ${displayImages.slice(1, 5).length === 1 ? 'grid-cols-2' : 'grid-cols-4'}`}>
                {displayImages.slice(1, 5).map((image, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-[4/5] overflow-hidden bg-muted"
                  >
                    <Image
                      src={image.url}
                      alt={`${product.title} — view ${idx + 2}`}
                      fill
                      sizes="15vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Editorial label */}
            <div className="flex items-center gap-3 pt-2">
              <div className="h-px flex-1 bg-border" />
              <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
                NUIX — {new Date().getFullYear()} Collection
              </p>
              <div className="h-px flex-1 bg-border" />
            </div>
          </div>

          {/* ── RIGHT: Product Info ────────────────────────── */}
          <div className="lg:sticky lg:top-24 lg:self-start space-y-7">

            {/* Category label */}
            {product.subtitle && (
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                {product.subtitle}
              </p>
            )}

            {/* Title */}
            <div>
              <h1
                className="font-heading font-bold leading-tight"
                style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '-0.02em' }}
              >
                {product.title}
              </h1>
            </div>

            <ProductViewTracker
              productId={product.id}
              productTitle={product.title}
              variantId={firstVariant?.id || null}
              currency={currency}
              value={priceAmount ?? null}
            />

            {/* ── Urgency Bar ────────────────────────────── */}
            <ProductUrgencyBar
              inventoryQuantity={hasInventoryData ? totalInventory : null}
              lowStockThreshold={25}
            />

            {/* ── Variant Selector + Price + Add to Cart ─── */}
            <ProductActions product={product} variantExtensions={variantExtensions} />

            {/* ── Bundle Offer ───────────────────────────── */}
            {bundleOffers.length > 0 && !isBundle && (
              <ProductBundleSelector
                currentProductTitle={product.title}
                currentVariantId={firstVariant?.id || null}
                singlePrice={singlePriceFormatted}
                bundleOffers={bundleOffers}
                currency={currency}
              />
            )}

            {/* ── Trust Badges ────────────────────────────── */}
            <ProductTrustBadges />

            {/* ── Product Details Accordion ───────────────── */}
            <ProductAccordion
              description={product.description}
              details={product.metadata as Record<string, string> | undefined}
            />

            {/* ── Social Proof Strip ──────────────────────── */}
            <div
              className="flex items-center gap-4 p-4 border border-border rounded-sm text-sm"
              style={{ backgroundColor: 'rgba(201,147,58,0.04)' }}
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full border-2 border-background bg-muted"
                    style={{ backgroundColor: `hsl(${i * 40}, 20%, 30%)` }}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground leading-snug">
                <strong className="text-foreground">240+ customers</strong> own this piece
                from the current collection
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
