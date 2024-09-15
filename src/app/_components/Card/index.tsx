'use client'

import React, { Fragment, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import { Heart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Product } from '../../../payload/payload-types'
import { useAuth } from '../../_providers/Auth'
import { useCart } from '../../_providers/Cart'
import { Media } from '../Media'
import { Price } from '../Price'
import RatingStars from '../Rating'

import classes from './index.module.scss'

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
  const { firebaseUser } = useAuth()
  const [isProductInWishlist, setIsProductInWishlist] = useState(false)

  const [
    price, // eslint-disable-line no-unused-vars
    setPrice,
  ] = useState(priceJSON)

  const {
    cart,
    addItemToCart,
    isProductInCart,
    hasInitializedCart,
    setHasInitializedCart,
    wishlist,
    setWishlistItems,
  } = useCart()
  const [isInCart, setIsInCart] = useState<boolean>()

  useEffect(() => {
    setIsInCart(isProductInCart(doc))

    const checkWishlist = async () => {
      const index = wishlist.findIndex(item => item.id === slug)
      setIsProductInWishlist(index !== -1)
    }

    checkWishlist()
  }, [isProductInCart, cart, doc, slug, firebaseUser, wishlist])

  const handleAddToCartClick = event => {
    event.stopPropagation()
    if (doc.stock <= 0) {
      toast.error('Currently not available in stock', { position: 'top-center' })
      return
    }
    if (!isInCart) {
      addItemToCart({
        product: doc,
        quantity: 1,
        imageUrl: typeof metaImage !== 'string' ? metaImage.url : 'abcd',
        price: priceJSON,
        id: doc.id,
      })
      if (!hasInitializedCart) {
        setHasInitializedCart(true)
      }
    }
  }

  const router = useRouter()

  const handleAddToWishlist = async id => {
    const token = await firebaseUser.getIdToken()
    const req = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/cart/add-to-wishlist?item_id=${id}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    const response = await req.json()
    setWishlistItems(
      response.data.data.map(item => ({
        id: item.itemId,
        product: item.itemName,
        imageUrl: item.imageUrl,
        price: item.price,
      })),
    )
  }

  const removeFromWishlist = async id => {
    const token = await firebaseUser.getIdToken()
    const req = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/cart/remove-wishlist?item_id=${id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    const response = await req.json()
    setWishlistItems(
      response.map(item => ({
        id: item.itemId,
        product: item.itemName,
        imageUrl: item.imageUrl,
        price: item.price,
      })),
    )
    const index = wishlist.findIndex(item => item.id === slug)
    setIsProductInWishlist(index !== -1)
  }

  return (
    <div className={classes.card}>
      <div className={classes.wishList}>
        <Heart
          className={classes.heart}
          onClick={event => {
            event.stopPropagation()
            if (isProductInWishlist) {
              removeFromWishlist(slug.toString())
            } else {
              handleAddToWishlist(slug.toString())
            }
          }}
          fill={isProductInWishlist ? 'red' : 'white'}
          style={{
            color: isProductInWishlist ? 'red' : 'black',
          }}
        />
      </div>
      <div className={classes.mediaWrapper} onClick={() => router.push(`${href}`)}>
        {!metaImage && <div className={classes.placeholder}>No image</div>}
        {metaImage && typeof metaImage !== 'string' && (
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
            {/* <p className={classes.description}>{sanitizedDescription}</p> */}
          </div>
        )}
        <div className={classes.details}>
          <div className={classes.priceSection}>
            <span className={classes.currentPrice}>₹{priceJSON}</span>
            <span className={classes.originalPrice}></span>
            <span className={classes.discount}></span>
          </div>
          <div className={classes.ratingSection}>
            <RatingStars rating={doc?.rating || 4} itemId={doc.id} disabled={true} />
          </div>
        </div>
        <button className={classes.addToCartButton} type="button" onClick={handleAddToCartClick}>
          <span className={classes.cartIcon}>
            <Image alt="cart" src="/assets/icons/icons8-cart-64.png" width={30} height={10} />
          </span>{' '}
          {isInCart ? 'Added to Cart' : 'Add to cart'}
        </button>
        {/* <button
          className={classes.addToWishlistButton}
          type="button"
          onClick={() => {
            if (isProductInWishlist) {
              removeFromWishlist(slug.toString())
            } else {
              handleAddToWishlist(slug.toString())
            }
          }}
        >
          <span className={classes.cartIcon}>
            <Heart width={30} height={30} />
          </span>{' '}
          {isProductInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        </button> */}
      </div>
    </div>
  )
}
