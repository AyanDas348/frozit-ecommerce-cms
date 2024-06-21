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
    console.log(json.data.data)
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
      {/* <Blocks
        disableTopPadding
        blocks={[
          {
            blockType: 'relatedProducts',
            blockName: 'Related Product',
            relationTo: 'products',
            introContent: [
              {
                type: 'h4',
                children: [
                  {
                    text: 'Related Products',
                  },
                ],
              },
              {
                type: 'p',
                children: [
                  {
                    text: 'The products displayed here are individually selected for this page. Admins can select any number of related products to display here and the layout will adjust accordingly. Alternatively, you could swap this out for the "Archive" block to automatically populate products by category complete with pagination. To manage related posts, ',
                  },
                  {
                    type: 'link',
                    url: `/admin/collections/products/${product.id}`,
                    children: [
                      {
                        text: 'navigate to the admin dashboard',
                      },
                    ],
                  },
                  {
                    text: '.',
                  },
                ],
              },
            ],
            docs: relatedProducts,
          },
        ]}
      /> */}
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
