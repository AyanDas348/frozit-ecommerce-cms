'use client'

import { Fragment, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Page } from '../../../payload/payload-types'
import { Button } from '../../_components/Button'
import { LoadingShimmer } from '../../_components/LoadingShimmer'
import { useAuth } from '../../_providers/Auth'
import { useCart } from '../../_providers/Cart'

import classes from './index.module.scss'

export default function Wishlist() {
  const { user, firebaseUser } = useAuth()

  const { wishlist, setWishlistItems } = useCart()
  const [currentWishlist, setWishlist] = useState(wishlist || [])

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
    const items = response.map(item => ({
      id: item.itemId,
      product: item.itemName,
      imageUrl: item.imageUrl,
      price: item.price,
    }))
    setWishlistItems(items)
    setWishlist(items)
  }

  useEffect(() => {
    setWishlist(wishlist || [])
  }, [wishlist])

  return (
    <Fragment>
      <br />
      <Fragment>
        {wishlist.length === 0 ? (
          <div className={classes.empty}>
            Your wishlist is empty.
            <Fragment>
              {' '}
              <Link href={`/products`}>Click here</Link>
              {` to shop.`}
            </Fragment>
            {!user && (
              <Fragment>
                {' '}
                <Link href={`/login?redirect=%2Fcart`}>Log in</Link>
                {` to view a saved wishlist.`}
              </Fragment>
            )}
          </div>
        ) : (
          <div className={classes.cart}>
            <div className={classes.cartWrapper}>
              <div>
                {/* CART LIST HEADER */}
                <div className={classes.header}>
                  <p>Products</p>
                  <div className={classes.headerItemDetails}>
                    <p></p>
                    <p></p>
                    <p>Action</p>
                  </div>
                  <p className={classes.headersubtotal}></p>
                </div>
                {/* CART ITEM LIST */}
                <ul className={classes.itemsList}>
                  {currentWishlist?.map((item, index) => {
                    return (
                      <li className={classes.item} key={item.id}>
                        <Link href={`/products/${item.id}`} className={classes.mediaWrapper}>
                          <Image
                            alt={item.product}
                            src={item.imageUrl}
                            width={400}
                            height={400}
                            className={classes.image}
                          />
                        </Link>
                        <div className={classes.itemDetails}>
                          <div className={classes.titleWrapper}>
                            <h6>{item.product}</h6>
                            {/* <Price product={product} button={false} /> */}
                          </div>
                        </div>
                        <div className={classes.subtotalWrapper}>
                          {/* Total : <Price product={product} quantity={quantity} button={false} amount={price} /> */}
                          <Button
                            label="Remove From Wishlist"
                            onClick={() => removeFromWishlist(item.id)}
                            appearance="primary"
                          ></Button>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </div>
        )}
      </Fragment>
    </Fragment>
  )
}
