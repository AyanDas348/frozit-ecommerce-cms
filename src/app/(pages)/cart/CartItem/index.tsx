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

const CartItem = ({ product, title, metaImage, qty, addItemToCart }) => {
  const [quantity, setQuantity] = useState(qty)
  const { user } = useAuth()

  const decrement = qty => {}

  const increment = qty => {}

  const enterQty = qty => {}

  console.log(product)

  return (
    <li className={classes.item} key={title}>
      <Link href={`/products/${product.slug}`} className={classes.mediaWrapper}>
        {!metaImage && <span>No Image</span>}
        {metaImage && typeof metaImage !== 'string' && (
          <Media className={classes.media} imgClassName={classes.image} resource={metaImage} fill />
        )}
      </Link>
      <div className={classes.itemDetails}>
        <div className={classes.titleWrapper}>
          <h6>{title}</h6>
          <Price product={product} button={false} />
        </div>
        <div className={classes.quantity}>
          <div className={classes.quantityBtn} onClick={decrement}>
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
          <div className={classes.quantityBtn} onClick={increment}>
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
        <div>
          <Button
            className={classes.checkoutButton}
            href={user ? '/checkout?buy=buy-now' : '/login?redirect=%2Fcheckout'}
            label={user ? 'Checkout' : 'Login to checkout'}
            appearance="primary"
          />
        </div>
        <RemoveFromCartButton product={product} />
        <Price product={product} quantity={quantity} button={false} />
      </div>
    </li>
  )
}

export default CartItem
