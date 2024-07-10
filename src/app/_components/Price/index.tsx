'use client'

import React, { useEffect, useState } from 'react'

import { Product } from '../../../payload/payload-types'
import { AddToCartButton } from '../AddToCartButton'
import { RemoveFromCartButton } from '../RemoveFromCartButton'

import classes from './index.module.scss'

export const priceFromJSON = (priceJSON: number, quantity: number = 1, raw?: boolean): string => {
  let price = ''

  if (priceJSON) {
    try {
      const priceValue = priceJSON * quantity

      if (raw) return priceValue.toString()

      price = priceValue.toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR',
      })
    } catch (e) {
      console.error(`Cannot parse priceJSON`) // eslint-disable-line no-console
    }
  }

  return price
}

export const Price: React.FC<{
  product: Product
  quantity?: number
  button?: 'addToCart' | 'removeFromCart' | false
  stock?: boolean | true
  amount?: number
}> = props => {
  const { product, product: { priceJSON } = {}, button = 'addToCart', quantity, amount } = props

  const [price, setPrice] = useState<{
    actualPrice: string
    withQuantity: string
  }>(() => ({
    actualPrice: priceFromJSON(priceJSON || amount),
    withQuantity: priceFromJSON(priceJSON || amount, quantity),
  }))

  useEffect(() => {
    setPrice({
      actualPrice: priceFromJSON(priceJSON || amount),
      withQuantity: priceFromJSON(priceJSON || amount, quantity),
    })
  }, [amount, priceJSON, quantity])

  return (
    <div className={classes.actions}>
      {typeof price?.actualPrice !== 'undefined' && price?.withQuantity !== '' && (
        <div className={classes.price}>
          <p>{price?.withQuantity}</p>
        </div>
      )}
      {product.stock <= 0 && props.stock && <p className={classes.outOfStock}>Out of Stock</p>}
    </div>
  )
}
