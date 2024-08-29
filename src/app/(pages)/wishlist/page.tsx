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

  const { cart, cartIsEmpty, addItemToCart, cartTotal, hasInitializedCart, isInWishlist } =
    useCart()
  const [wishlist, setWishlist] = useState([])

  useEffect(() => {
    const getWishlist = async () => {
      const req = await isInWishlist()
      console.log(req)
      setWishlist(req)
    }
    getWishlist()
  }, [firebaseUser])

  console.log(wishlist)

  return (
    <Fragment>
      <br />
      <Fragment>
        {cartIsEmpty ? (
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
                  {wishlist?.map((item, index) => {
                    return (
                      <li className={classes.item} key={item.itemId}>
                        <Link href={`/products/${item.itemId}`} className={classes.mediaWrapper}>
                          <Image
                            alt={item.itemName}
                            src={item.imageUrl}
                            width={400}
                            height={400}
                            className={classes.image}
                          />
                        </Link>
                        <div className={classes.itemDetails}>
                          <div className={classes.titleWrapper}>
                            <h6>{item.itemName}</h6>
                            {/* <Price product={product} button={false} /> */}
                          </div>
                        </div>
                        <div className={classes.subtotalWrapper}>
                          {/* Total : <Price product={product} quantity={quantity} button={false} amount={price} /> */}
                          Remove From Wishlist
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
