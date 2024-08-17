import React from 'react'

import { Product, Product as ProductType } from '../../../../payload/payload-types'
import { ProductHero } from '../../../_heros/Product'
import { onlineItems } from '../../../constants/items'

export default async function ProductFunc({ params: { slug } }) {
  const hardcodedItem = onlineItems?.find(item => item.id === slug.toString())
  const req = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/itemsInventory/get-item-details?item_id=${slug}`,
  )
  const json = await req.json()

  let product: Product | null = {
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
    title: json?.data?.data?.name,
    updatedAt: Date.now().toString(),
    priceJSON: json.data.data.rate,
    stock: json.data.data.stock_on_hand,
    meta: {
      description: json.data.data.description,
      title: json.data.data.name,
      image: {
        alt: hardcodedItem.meta.image.alt,
        createdAt: hardcodedItem.meta.image.createdAt,
        id: hardcodedItem.meta.image.id,
        updatedAt: hardcodedItem.meta.image.updatedAt,
        url: hardcodedItem.meta.image.url,
        urls: json.data.data.imageUrls,
      },
    },
    categories: '1697951000000336031',
    rating: json?.data?.data?.rating || 4,
  }

  try {
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
      title: json.data.data.name,
      updatedAt: Date.now().toString(),
      priceJSON: json.data.data.rate,
      stock: json.data.data.stock_on_hand,
      meta: {
        description: json.data.data.description,
        title: json.data.data.name,
        image: {
          alt: hardcodedItem.meta.image.alt,
          createdAt: hardcodedItem.meta.image.createdAt,
          id: hardcodedItem.meta.image.id,
          updatedAt: hardcodedItem.meta.image.updatedAt,
          url: hardcodedItem.meta.image.url,
          urls: json.data.data.imageUrls,
        },
      },
      categories: json.data.data.category_id,
    }
  } catch (error) {
    console.error(error) // eslint-disable-line no-console
  }

  // if (!product) {
  //   notFound()
  // }

  const { layout, relatedProducts } = product

  return (
    <React.Fragment>
      <ProductHero product={product} />
      {/* <Blocks blocks={layout} /> */}
      {/* {product?.enablePaywall && <PaywallBlocks productSlug={slug as string} disableTopPadding />} */}
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
