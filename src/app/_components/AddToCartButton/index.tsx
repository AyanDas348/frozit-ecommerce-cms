'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Product } from '../../../payload/payload-types'
import { useCart } from '../../_providers/Cart'
import { Button, Props } from '../Button'

import classes from './index.module.scss'
import { useAuth } from '../../_providers/Auth'

export const AddToCartButton: React.FC<{
  product: Product
  quantity?: number
  className?: string
  appearance?: Props['appearance']
}> = props => {
  const { product, className, appearance = 'primary' } = props

  const { cart, isProductInCart, hasInitializedCart } = useCart()

  const [isInCart, setIsInCart] = useState<boolean>(false)
  const [quantity, setQuantity] = useState<number>(1)
  const [cartItemId, setCartItemId] = useState<string | null>(null)
  const { user, status: authStatus, firebaseUser } = useAuth()

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

  // Update cart method
  const updateCart = async (cartItemId: string, change: number) => {
    if (!firebaseUser) {
      console.error('User is not authenticated')
      return
    }

    try {
      const newQuantity = change // Prevent quantity from going below 1
      const token = await firebaseUser.getIdToken()
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/cart/update-cart`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ item_id: cartItemId, quantity: newQuantity }),
      })

      if (!response.ok) {
        throw new Error('Failed to update cart')
      }

      setQuantity(quantity + change)
    } catch (error) {
      console.error('Error updating cart:', error)
    }
  }

  // Add to Cart Handler
  const handleAddToCart = async () => {
    if (!firebaseUser) {
      console.error('User is not authenticated')
      return
    }

    try {
      const token = await firebaseUser.getIdToken()
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/cart/add-to-cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify([{
          item_id: product.id,
          quantity: quantity,
          imageUrl: typeof product.meta.image !== 'string' ? product.meta.image.url : '',
          price: product.priceJSON,
        }]),
      })

      if (!response.ok) {
        throw new Error('Failed to add to cart')
      }


    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  return (
    <div className={className}>
      {isInCart ? (
        <div className={classes.quantityControls}>
          <Button
            label="-"
            onClick={() => updateCart(cartItemId!, -1)} // Reduce quantity by 1
            disabled={quantity <= 1} // Disable button if quantity is 1
          />
          <span>{quantity}</span>
          <Button
            label="+"
            onClick={() => updateCart(cartItemId!, 1)} // Increase quantity by 1
          />
          <Button
            href="/cart"
            el="link"
            label="✓ View in cart"
            appearance={appearance}
            className={[classes.viewInCartButton, appearance === 'default' && classes.green].join(' ')}
          />
        </div>
      ) : (
        <Button
          type="button"
          label="Add to cart"
          appearance={appearance}
          className={[
            className,
            classes.addToCartButton,
            !hasInitializedCart && classes.hidden,
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={handleAddToCart}
        />
      )}
    </div>
  )
}
