'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import ProductGrid from '@/components/product/product-grid'

interface CollectionSectionProps {
  collection: {
    id: string
    handle: string
    title: string
    metadata?: Record<string, unknown>
  }
  alternate?: boolean
}

export default function CollectionSection({ collection, alternate }: CollectionSectionProps) {
  const description = collection.metadata?.description
  const hasDescription = typeof description === 'string' && description

  return (
    <section className={`py-section ${alternate ? 'bg-muted/20' : 'bg-background'}`}>
      <div className="container-custom">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-6" style={{ backgroundColor: '#c9933a' }} />
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                Collection
              </p>
            </div>
            <h2
              className="font-heading font-bold"
              style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)', letterSpacing: '-0.02em' }}
            >
              {collection.title}
            </h2>
            {hasDescription && (
              <p className="text-muted-foreground mt-2 max-w-md text-sm leading-relaxed">
                {description}
              </p>
            )}
          </div>
          <Link
            href={`/collections/${collection.handle}`}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
            prefetch={true}
          >
            View All
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <ProductGrid collectionId={collection.id} limit={4} />
      </div>
    </section>
  )
}
