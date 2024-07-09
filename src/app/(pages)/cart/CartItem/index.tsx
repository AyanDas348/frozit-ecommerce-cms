'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { Button } from '../../../_components/Button'
import { Media } from '../../../_components/Media'
import { Price } from '../../../_components/Price'
import { RemoveFromCartButton } from '../../../_components/RemoveFromCartButton'
import { useAuth } from '../../../_providers/Auth'

import classes from './index.module.scss'

const CartItem = ({ product, title, metaImage, qty, addItemToCart, price }) => {
  console.log(metaImage)
  const [quantity, setQuantity] = useState(qty)
  const { user } = useAuth()
  const decrementQty = () => {
    const updatedQty = quantity > 1 ? quantity - 1 : 1

    setQuantity(updatedQty)
    addItemToCart({ product, quantity: Number(updatedQty) })
  }

  const incrementQty = () => {
    const updatedQty = quantity + 1

    setQuantity(updatedQty)
    addItemToCart({ product, quantity: Number(updatedQty) })
  }

  const enterQty = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedQty = Number(e.target.value)

    setQuantity(updatedQty)
    addItemToCart({ product, quantity: Number(updatedQty) })
  }

  return (
    <li className={classes.item} key={title}>
      <Link href={`/products/${product.slug}`} className={classes.mediaWrapper}>
        {!metaImage && <span>No Image</span>}
        {metaImage && typeof metaImage !== 'string' && (
          <Image
            alt={title}
            src={metaImage.url}
            width={300}
            height={300}
            className={classes.image}
          />
        )}
      </Link>
      <div className={classes.itemDetails}>
        <div className={classes.titleWrapper}>
          <h6>{title}</h6>
          {/* <Price product={product} button={false} /> */}
        </div>
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
        <RemoveFromCartButton product={product} />
      </div>
    </li>
  )
}

export default CartItem
