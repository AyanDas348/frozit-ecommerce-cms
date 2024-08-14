'use client'

import React, { Fragment, useEffect, useState } from 'react'
import { FaShareAlt } from 'react-icons/fa'
import { toast } from 'react-toastify'

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
  const { title, categories, meta: { image: metaImage, description } = {}, stock } = product
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
            image: {
              alt: item.image_name,
              caption: null,
              filename: item.image_name,
              height: 2865,
              width: 2200,
              mimeType: item.image_type,
              url: onlineItems.find(i => i.id === item.item_id).meta.image.url
                ? onlineItems.find(i => i.id === item.item_id).meta.image.url
                : item.imageUrl,
            },
            title: 'item details',
          },
          priceJSON: item.rate,
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

  return (
    <Gutter>
      <Gutter className={classes.productHero}>
        <div className={classes.mediaWrapper}>
          {!metaImage && <div className={classes.placeholder}>No image</div>}
          {metaImage && typeof metaImage !== 'string' && (
            <Media className={classes.image} resource={metaImage} fill />
          )}
        </div>

        <div className={classes.details}>
          <h3 className={classes.title}>{title}</h3>

          {/* <div className={classes.categoryWrapper}>
            <div className={classes.categories}>
              {categories?.map((category, index) => {
                const { title: categoryTitle } = category as Category

                const titleToUse = categoryTitle || 'Generic'
                const isLast = index === categories.length - 1

                return (
                  <p key={index} className={classes.category}>
                    {titleToUse} {!isLast && <Fragment>, &nbsp;</Fragment>}
                    <span className={classes.separator}>|</span>
                  </p>
                )
              })}
            </div>
          </div> */}

          <Price product={product} button={'addToCart'} />

          <div className={classes.description}>
            {/* <h6>Description</h6> */}
            <p>{description}</p>
          </div>
          <div className={classes.addToCart}>
            <AddToCartButton product={product} className={classes.addToCartButton} />
            <button className={classes.shareButton} onClick={() => handleShare()}>
              <FaShareAlt />
            </button>
          </div>
          <div className={classes.rating}>
            <RatingStars rating={product.rating} disabled={true} itemId={product.id} />
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
