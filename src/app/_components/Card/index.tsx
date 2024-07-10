'use client'

import React, { Fragment, useEffect, useState } from 'react'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Product } from '../../../payload/payload-types'
import { useCart } from '../../_providers/Cart'
import { Media } from '../Media'
import { Price } from '../Price'

import classes from './index.module.scss'

// const priceFromJSON = (priceJSON): string => {
//   let price = ''

//   if (priceJSON) {
//     try {
//       const parsed = JSON.parse(priceJSON)?.data[0]
//       const priceValue = parsed.unit_amount
//       const priceType = parsed.type
//       price = `${parsed.currency === 'usd' ? '$' : ''}${(priceValue / 100).toFixed(2)}`
//       if (priceType === 'recurring') {
//         price += `/${
//           parsed.recurring.interval_count > 1
//             ? `${parsed.recurring.interval_count} ${parsed.recurring.interval}`
//             : parsed.recurring.interval
//         }`
//       }
//     } catch (e) {
//       console.error(`Cannot parse priceJSON`) // eslint-disable-line no-console
//     }
//   }

//   return price
// }

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  showCategories?: boolean
  hideImagesOnMobile?: boolean
  title?: string
  relationTo?: 'products'
  doc?: Product
}> = props => {
  const {
    showCategories,
    title: titleFromProps,
    doc,
    doc: { slug, title, categories, meta, priceJSON } = {},
    className,
  } = props

  const { description, image: metaImage } = meta || {}
  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/products/${slug}`

  const [
    price, // eslint-disable-line no-unused-vars
    setPrice,
  ] = useState(priceJSON)

  // useEffect(() => {
  //   ;(async () => {
  //     console.log(metaImage)
  //     if (typeof metaImage !== 'string' && metaImage.url !== '') {
  //       const response = await axios.get(
  //         `https://www.zohoapis.com/inventory/v1/documents/${slug}?organization_id=60029131613`,
  //       )

  //       console.log(response)

  //       if (!response.status) {
  //         throw new Error('Network response was not ok')
  //       }
  //     }
  //   })()
  // }, [metaImage, slug])

  const { cart, addItemToCart, isProductInCart, hasInitializedCart } = useCart()
  const [isInCart, setIsInCart] = useState<boolean>()

  useEffect(() => {
    setIsInCart(isProductInCart(doc))
  }, [isProductInCart, cart, doc])

  const handleAddToCartClick = event => {
    event.stopPropagation() // Prevents the click event from propagating to the parent Link
    if (!isInCart) {
      addItemToCart({
        product: doc,
        quantity: 1,
        imageUrl: typeof metaImage !== 'string' ? metaImage.url : 'abcd',
        price: priceJSON,
        id: doc.id,
      })
    }
  }

  const router = useRouter()

  return (
    <div className={classes.card}>
      <div className={classes.mediaWrapper} onClick={() => router.push(`${href}`)}>
        {!metaImage && <div className={classes.placeholder}>No image</div>}
        {metaImage && typeof metaImage !== 'string' && metaImage.url.startsWith('/assets') && (
          <Image
            alt={titleToUse}
            src={metaImage.url}
            width={300}
            height={300}
            className={classes.image}
          />
        )}
      </div>
      <div className={classes.content}>
        {/* <div className={classes.discountBadge}>10% Off</div> */}
        {titleToUse && <h4 className={classes.title}>{titleToUse}</h4>}
        {description && (
          <div className={classes.body}>
            <p className={classes.description}>{sanitizedDescription}</p>
          </div>
        )}
        <div className={classes.priceSection}>
          <span className={classes.currentPrice}>₹{priceJSON}</span>
          <span className={classes.originalPrice}></span>
          <span className={classes.discount}></span>
        </div>
        <button className={classes.addToCartButton} type="button" onClick={handleAddToCartClick}>
          <span className={classes.cartIcon}>
            <Image alt="cart" src="/assets/icons/icons8-cart-64.png" width={30} height={10} />
          </span>{' '}
          {isInCart ? 'Added to Cart' : 'Add to cart'}
        </button>
      </div>
    </div>
  )
}
