import Image from 'next/image'
import Link from 'next/link'
import { getProductImage } from '@/lib/utils/placeholder-images'
import ProductPrice, { isProductSoldOut, type VariantExtension } from './product-price'

interface ProductCardProps {
  product: any
  variantExtensions?: Record<string, VariantExtension>
}

export default function ProductCard({ product, variantExtensions }: ProductCardProps) {
  const variant = product.variants?.[0]
  const calculatedPrice = variant?.calculated_price

  const currency = calculatedPrice?.currency_code || 'usd'
  const currentAmount = calculatedPrice?.calculated_amount
  const ext = variant?.id ? variantExtensions?.[variant.id] : null

  const soldOut = isProductSoldOut(product.variants || [], variantExtensions)
  const isBundle = product.handle?.includes('bundle')

  return (
    <Link href={`/products/${product.handle}`} className="group block" prefetch={true}>
      <div className="space-y-3">
        {/* Product Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          {/* Badge */}
          {isBundle && !soldOut && (
            <div
              className="absolute top-3 left-3 z-10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-black"
              style={{ backgroundColor: '#c9933a' }}
            >
              Bundle
            </div>
          )}
          {soldOut && (
            <div className="absolute top-3 left-3 z-10 bg-muted-foreground/80 text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1">
              Sold Out
            </div>
          )}
          {ext?.compare_at_price && ext.compare_at_price > 0 && !soldOut && !isBundle && (
            <div
              className="absolute top-3 left-3 z-10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-black"
              style={{ backgroundColor: '#c9933a' }}
            >
              Sale
            </div>
          )}
          <Image
            src={getProductImage(product.thumbnail, product.id)}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={`object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${soldOut ? 'opacity-40' : ''}`}
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        </div>

        {/* Product Info */}
        <div className="space-y-1.5">
          <h3 className={`text-xs font-semibold tracking-wide uppercase line-clamp-1 transition-opacity group-hover:opacity-70 ${soldOut ? 'text-muted-foreground' : ''}`}>
            {product.title}
          </h3>
          <ProductPrice
            amount={currentAmount}
            currency={currency}
            compareAtPrice={ext?.compare_at_price}
            soldOut={soldOut}
            size="card"
          />
        </div>
      </div>
    </Link>
  )
}
