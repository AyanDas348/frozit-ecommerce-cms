'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { Product } from '../../../payload/payload-types'
import { useAuth } from '../../_providers/Auth'
import { useCart } from '../../_providers/Cart'
import { Button, Props } from '../Button'

import classes from './index.module.scss'

export const AddToCartButton: React.FC<{
  product: Product
  quantity?: number
  className?: string
  appearance?: Props['appearance']
}> = props => {
  const { product, className, appearance = 'primary' } = props

  const { cart, isProductInCart, hasInitializedCart, addItemToCart } = useCart()

  const [isInCart, setIsInCart] = useState<boolean>(false)
  const [quantity, setQuantity] = useState<number>(1)
  const [cartItemId, setCartItemId] = useState<string | null>(null)
  const { firebaseUser } = useAuth()

  const router = useRouter()

  useEffect(() => {
    const inCart = isProductInCart(product)
    setIsInCart(inCart)

    if (inCart) {
      const item = cart.items.find(i => {
        if (i.product && typeof i.product !== 'string') {
          return i.product.id === product.id
        }
        return false
      })

      if (item) {
        setQuantity(item.quantity ?? 1)
        setCartItemId(item.id ?? null)
      }
    }
  }, [isProductInCart, product, cart])

  useEffect(() => {
    setIsInCart(isProductInCart(product))
  }, [isProductInCart, product, cart])

  // Update cart method
  const updateCart = async (cartItemId: string, change: number) => {
    if (!firebaseUser) {
      console.error('User is not authenticated')
      return
    }

    try {
      const newQuantity = quantity + change
      if (newQuantity < 0) return // Prevent quantity from going below 0

      const token = await firebaseUser.getIdToken()
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/cart/update-cart`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ item_id: cartItemId, quantity: change }),
      })

      if (!response.ok) {
        throw new Error('Failed to update cart')
      }

      setQuantity(newQuantity)
    } catch (error) {
      console.error('Error updating cart:', error)
    }
  }

  const enterQty = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedQty = Number(e.target.value)

    setQuantity(updatedQty)
    addItemToCart({ product, quantity: Number(updatedQty), price: product.priceJSON })
  }

  return (
    <div className={className}>
      {isInCart ? (
        <div className={classes.quantityControls}>
          <div className={classes.fields}>
            <div
              onClick={() => cartItemId && updateCart(cartItemId, -1)} // Reduce quantity by 1
              className={classes.quantityButton} // Apply button styles
            >
              <Image
                src="/assets/icons/minus.svg"
                alt="minus"
                width={24}
                height={24}
                className={classes.qtnBt}
              />
            </div>
            <input
              className={classes.quantityInput}
              type="text"
              value={quantity}
              onChange={enterQty}
            />
            <div
              onClick={() => cartItemId && updateCart(cartItemId, 1)} // Increase quantity by 1
              className={classes.quantityButton} // Apply button styles
            >
              <Image
                src="/assets/icons/plus.svg"
                alt="plus"
                width={24}
                height={24}
                className={classes.qtnBt}
              />
            </div>
          </div>

          <Button
            href="/cart"
            el="link"
            label="✓ View in cart"
            appearance={appearance}
            className={[classes.viewInCartButton, appearance === 'default' && classes.green].join(
              ' ',
            )}
          />
        </div>
      ) : (
        <Button
          type="button"
          label="Add to cart"
          appearance={appearance}
          className={[className, classes.addToCartButton, !hasInitializedCart && classes.hidden]
            .filter(Boolean)
            .join(' ')}
          onClick={
            !isInCart
              ? () => {
                  addItemToCart({
                    product,
                    quantity,
                    imageUrl: typeof product.meta.image !== 'string' ? product.meta.image.url : '',
                    price: product.priceJSON,
                    id: product.id,
                  })

                  // router.push('/cart')
                }
              : undefined
          }
        />
      )}
    </div>
  )
}
