import React from 'react'
import { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'

import { Product, Product as ProductType } from '../../../../payload/payload-types'
import { fetchDoc } from '../../../_api/fetchDoc'
import { fetchDocs } from '../../../_api/fetchDocs'
import { Blocks } from '../../../_components/Blocks'
import { PaywallBlocks } from '../../../_components/PaywallBlocks'
import { ProductHero } from '../../../_heros/Product'
import { generateMeta } from '../../../_utilities/generateMeta'

// Force this page to be dynamic so that Next.js does not cache it
// See the note in '../../../[slug]/page.tsx' about this
export const dynamic = 'force-dynamic'

interface ZohoProduct {
  categories: []
  id: string
  meta: {
    description: string
    image: {
      alt: string
      caption: null
      filename: string
      height: number
      width: number
      mimeType: 'image/png'
    }
    title: 'item details'
  }
  priceJSON: number
  slug: string
  title: string
}

export default async function ProductFunc({ params: { slug } }) {
  const { isEnabled: isDraftMode } = draftMode()

  let product: Product | null = null

  try {
    // product = await fetchDoc<Product>({
    //   collection: 'products',
    //   slug,
    //   draft: isDraftMode,
    // })
    const req = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/itemsInventory/get-item-details?item_id=${slug}`,
    )
    const json = await req.json()
    product = {
      createdAt: Date.now().toString(),
      id: slug,
      layout: [
        {
          columns: [],
          id: slug,
          blockType: 'content',
        },
      ],
      slug: slug,
      _status: 'published',
      title: json.data.data.item.name,
      updatedAt: Date.now().toString(),
      priceJSON: json.data.data.item.sales_rate,
      stock: json.data.data.item.warehouses.find(
        warehouse => warehouse.warehouse_id === '1697951000000042277',
      ).warehouse_stock_on_hand,
      meta: {
        description: json.data.data.item.description,
        title: json.data.data.item.name,
      },
    }
  } catch (error) {
    console.error(error) // eslint-disable-line no-console
  }

  if (!product) {
    notFound()
  }

  const { layout, relatedProducts } = product

  return (
    <React.Fragment>
      <ProductHero product={product} />
      <Blocks blocks={layout} />
      {product?.enablePaywall && <PaywallBlocks productSlug={slug as string} disableTopPadding />}
    </React.Fragment>
  )
}

// export async function generateStaticParams() {
//   try {
//     const products = await fetchDocs<ProductType>('products')
//     return products?.map(({ slug }) => slug)
//   } catch (error) {
//     return []
//   }
// }

// export async function generateMetadata({ params: { slug } }): Promise<Metadata> {
//   const { isEnabled: isDraftMode } = draftMode()

//   let product: Product | null = null

//   try {
//     product = await fetchDoc<Product>({
//       collection: 'products',
//       slug,
//       draft: isDraftMode,
//     })
//   } catch (error) {}

//   return generateMeta({ doc: product })
// }
