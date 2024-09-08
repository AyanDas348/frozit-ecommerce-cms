'use client'

import React, { Fragment, useEffect, useState } from 'react'
import { FaShareAlt } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

import { Category, Product } from '../../../payload/payload-types'
import { AddToCartButton } from '../../_components/AddToCartButton'
import { Card } from '../../_components/Card'
import { Gutter } from '../../_components/Gutter'
import { Media } from '../../_components/Media'
import { Price } from '../../_components/Price'
import RatingStars from '../../_components/Rating'
import { onlineItems } from '../../constants/items'

import classes from './index.module.scss'

export const ProductHero: React.FC<{
  product: Product
}> = ({ product }) => {
  const {
    title,
    categories,
    meta: { image: metaImage, description, ingredients } = {},
    stock,
  } = product
  const outOfStock = stock <= 0

  const [relatedProducts, setRelatedProducts] = useState([])

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const request = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/itemsInventory/get-categories?category_id=${categories}`,
        )

        const response = await request.json()

        if (!response.success) {
          throw new Error(`Error fetching data: ${request.statusText}`)
        }

        const mappedProducts = response.data.data.items.map(item => ({
          categories: item.category_id,
          id: item.item_id,
          meta: {
            description: item.description || '',
            ingredients: item.cf_ingredients || '', // Check if this field is populated
            image: {
              alt: item.image_name,
              caption: null,
              filename: item.image_name,
              height: 2865,
              width: 2200,
              mimeType: item.image_type,
              url: onlineItems.find(i => i.id === item.item_id)?.meta.image.url
                ? onlineItems.find(i => i.id === item.item_id).meta.image.url
                : item.imageUrl,
            },
            title: 'item details',
          },
          priceJSON: item.online_discount
            ? item.rate - item.rate * ((item.cf_online_discount || 0) / 100)
            : item.rate,
          originalPriceJSON: item.rate,
          slug: item.item_id,
          title: item.item_name,
          stock: item.actual_available_stock,
          rating: 4,
        }))

        setRelatedProducts(mappedProducts)
      } catch (error) {
        console.error('Failed to fetch related products:', error)
      }
    }

    fetchRelatedProducts()
  }, [categories])

  const handleShare = () => {
    const productUrl = window.location.href
    navigator.clipboard.writeText(productUrl).then(
      () => {
        toast.success('Product URL copied to clipboard!', { position: 'top-center' })
      },
      err => {
        toast.error('Failed to copy: ', err)
      },
    )
  }

  const [selectedIndex, setSelectedIndex] = useState(0)

  const handleLeftClick = () => {
    if (metaImage && typeof metaImage !== 'string') {
      setSelectedIndex(prevIndex => {
        const length = metaImage.urls?.length || 1
        return prevIndex === 0 ? length - 1 : prevIndex - 1
      })
    }
  }

  const handleRightClick = () => {
    if (metaImage && typeof metaImage !== 'string') {
      setSelectedIndex(prevIndex => {
        const length = metaImage.urls?.length || 1
        return prevIndex === length - 1 ? 0 : prevIndex + 1
      })
    }
  }

  return (
    <Gutter>
      <Gutter className={classes.productHero}>
        <div className={classes.mediaWrapper}>
          {!metaImage && <div className={classes.placeholder}>No image</div>}
          {metaImage && typeof metaImage !== 'string' && (
            <Image
              className={classes.image}
              src={
                (metaImage.urls || []).length > 0 ? metaImage.urls[selectedIndex] : metaImage.url
              }
              fill
              alt={title}
            />
          )}
          {typeof metaImage !== 'string' && (metaImage.urls || [])?.length > 0 && (
            <ChevronLeft className={classes.imageLeft} onClick={() => handleLeftClick()} />
          )}
          {typeof metaImage !== 'string' && (metaImage.urls || [])?.length > 0 && (
            <ChevronRight className={classes.imageRight} onClick={() => handleRightClick()} />
          )}
        </div>

        <div className={classes.details}>
          <h3 className={classes.title}>{title}</h3>

          <Price product={product} button={'addToCart'} />
          <div className={classes.rating}>
            <RatingStars
              rating={product.rating ? 4 : product.rating}
              disabled={true}
              itemId={product.id}
            />
            <button className={classes.shareButton} onClick={() => handleShare()}>
              <FaShareAlt />
            </button>
          </div>
          <div className={classes.description}>
            <p>{description}</p>
          </div>
          {ingredients && (
            <div className={classes.ingredients}>
              <h6>Ingredients</h6>
              <p>{ingredients}</p>
            </div>
          )}
          <div className={classes.addToCart}>
            <AddToCartButton product={product} className={classes.addToCartButton} />
          </div>
        </div>
      </Gutter>
      <Gutter>
        <div>
          <h2>Product you might also like</h2>
          <div className={classes.grid}>
            {relatedProducts.slice(0, 4)?.map((result, index) => {
              return <Card key={index} relationTo="products" doc={result} showCategories />
            })}
          </div>
        </div>
      </Gutter>
    </Gutter>
  )
}
