'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { Media } from '../../../_components/Media'
import { Price } from '../../../_components/Price'
import { RemoveFromCartButton } from '../../../_components/RemoveFromCartButton'
import { useAuth } from '../../../_providers/Auth'
import { CartItem as CartItemType } from '../../../_providers/Cart/reducer'

import classes from './index.module.scss'

interface Media {
  url?: string
  alt?: string
}

interface CartItemProps {
  product: any
  title: string
  metaImage: string | Media
  qty: number
  addItemToCart?: (item: CartItemType) => void
  price: number
  isCheckout?: boolean
}

const CartItem: React.FC<CartItemProps> = ({
  product,
  title,
  metaImage,
  qty,
  addItemToCart,
  price,
  isCheckout = false,
}) => {
  console.log(metaImage)
  const [quantity, setQuantity] = useState(qty)
  const { user } = useAuth()
  const decrementQty = () => {
    const updatedQty = quantity > 1 ? quantity - 1 : 1

    setQuantity(updatedQty)
    addItemToCart({ product, quantity: Number(updatedQty), price })
  }

  const incrementQty = () => {
    const updatedQty = quantity + 1

    setQuantity(updatedQty)
    addItemToCart({ product, quantity: Number(updatedQty), price })
  }

  const enterQty = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedQty = Number(e.target.value)

    setQuantity(updatedQty)
    addItemToCart({ product, quantity: Number(updatedQty), price })
  }

  return (
    <li className={classes.item} key={title}>
      <Link href={`/products/${product.slug}`} className={classes.mediaWrapper}>
        {!metaImage && <span>No Image</span>}
        {metaImage && typeof metaImage !== 'string' && metaImage.url.startsWith('/assets') && (
          <Image
            alt={title}
            src={metaImage.url}
            width={400}
            height={400}
            className={classes.image}
          />
        )}
      </Link>
      <div className={classes.itemDetails}>
        <div className={classes.titleWrapper}>
          <h6>{title}</h6>
          {/* <Price product={product} button={false} /> */}
        </div>
        {!isCheckout && (
          <div className={classes.quantity}>
            <div className={classes.quantityBtn} onClick={decrementQty}>
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
            <div className={classes.quantityBtn} onClick={incrementQty}>
              <Image
                src="/assets/icons/plus.svg"
                alt="plus"
                width={24}
                height={24}
                className={classes.qtnBt}
              />
            </div>
          </div>
        )}
      </div>
      <div className={classes.subtotalWrapper}>
        {/* <div>
          <Button
            className={classes.checkoutButton}
            href={user ? '/checkout?buy=buy-now' : '/login?redirect=%2Fcheckout'}
            label={user ? 'Checkout' : 'Login to checkout'}
            appearance="primary"
          />
        </div> */}
        Total : <Price product={product} quantity={quantity} button={false} amount={price} />
        {!isCheckout && <RemoveFromCartButton product={product} />}
      </div>
    </li>
  )
}

export default CartItem
