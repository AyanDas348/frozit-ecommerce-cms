'use client'

import React, { Fragment, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Page, Settings, User } from '../../../../payload/payload-types'
import { Button } from '../../../_components/Button'
import { HR } from '../../../_components/HR'
import { LoadingShimmer } from '../../../_components/LoadingShimmer'
import { Media } from '../../../_components/Media'
import PhoneLoginModal from '../../../_components/PhoneLoginModal'
import { Price } from '../../../_components/Price'
import { RemoveFromCartButton } from '../../../_components/RemoveFromCartButton'
import { useAuth } from '../../../_providers/Auth'
import { useCart } from '../../../_providers/Cart'
import AddAddressForm from '../AddAddressForm'
import CartItem from '../CartItem'
import Modal from '../Modal'
import SelectAddressModal from '../SelectAddressModal'

import classes from './index.module.scss'

interface Address {
  street: string
  city: string
  state: string
  pinCode: string
  country: string
  plotNo: string
}

export const CartPage: React.FC<{
  page: Page
}> = props => {
  const { user } = useAuth()

  const { cart, cartIsEmpty, addItemToCart, cartTotal, hasInitializedCart } = useCart()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(() => {
    const storedIndex = localStorage.getItem('selectedAddressIndexFrozit')
    return storedIndex !== null ? JSON.parse(storedIndex) : 0
  })

  const [showChangeAddressModal, setShowChangeAddressModal] = useState(false)
  const [addAddressModal, setAddAddressModal] = useState(false)

  useEffect(() => {
    if (user) {
      const getAddresses = async (): Promise<{ success: boolean; data: User }> => {
        const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/get-user`, {
          method: 'GET',
          headers: {
            Authorization: user.jwt,
          },
        })
        const data = await req.json()
        return data
      }
      getAddresses().then(response => {
        if (response.success && typeof response.data !== 'undefined') {
          setAddresses(response.data.userData.address)
        }
      })
    }
  }, [user])

  const [isPhoneLoginModalOpen, setIsPhoneLoginModalOpen] = useState(false)
  const router = useRouter()

  const handleCheckoutClick = () => {
    if (!user) {
      setIsPhoneLoginModalOpen(true)
    } else {
      router.push(`/checkout?addressId=${selectedAddressIndex}`)
    }
  }

  return (
    <Fragment>
      <br />
      {!hasInitializedCart ? (
        <div className={classes.loading}>
          <LoadingShimmer />
        </div>
      ) : (
        <Fragment>
          {cartIsEmpty ? (
            <div className={classes.empty}>
              Your cart is empty.
              <Fragment>
                {' '}
                <Link href={`/products`}>Click here</Link>
                {` to shop.`}
              </Fragment>
              {!user && (
                <Fragment>
                  {' '}
                  <Link href={`/login?redirect=%2Fcart`}>Log in</Link>
                  {` to view a saved cart.`}
                </Fragment>
              )}
            </div>
          ) : (
            <div className={classes.cart}>
              {user && (
                <div className={classes.addressWrapper}>
                  {addresses.length === 0 ? (
                    <div id="address">
                      <p>No Address Available</p>
                      <Button
                        type="button"
                        appearance="primary"
                        onClick={() => {
                          setAddAddressModal(true)
                        }}
                      >
                        + Add New
                      </Button>
                    </div>
                  ) : (
                    <div className={classes.addressContainer}>
                      <div className={classes.addressList}>
                        <p>Delivering To:</p>
                        <p>{addresses[selectedAddressIndex].street},&nbsp;</p>
                        <p>
                          {addresses[selectedAddressIndex].city},{' '}
                          {addresses[selectedAddressIndex].state}&nbsp;
                        </p>
                        <p>
                          {addresses[selectedAddressIndex].pinCode},{' '}
                          {addresses[selectedAddressIndex].country}
                        </p>
                      </div>
                      <button
                        className={classes.changeButton}
                        onClick={() => {
                          setShowChangeAddressModal(true)
                        }}
                      >
                        Change
                      </button>
                    </div>
                  )}
                  {showChangeAddressModal && (
                    <SelectAddressModal
                      addresses={addresses}
                      onClose={() => {
                        setShowChangeAddressModal(false)
                      }}
                      onOpenAddAddressModal={() => {
                        setShowChangeAddressModal(false)
                        setAddAddressModal(true)
                      }}
                      setSelectedAddressIndex={setSelectedAddressIndex}
                      selectedAddressIndex={selectedAddressIndex}
                    />
                  )}
                  {addAddressModal && (
                    <Modal
                      onClose={() => {
                        setAddAddressModal(false)
                        setShowChangeAddressModal(false)
                      }}
                    >
                      <AddAddressForm
                        setAddresses={setAddresses}
                        setSelectedAddressIndex={setSelectedAddressIndex}
                        close={() => setAddAddressModal(false)}
                      />
                    </Modal>
                  )}
                </div>
              )}
              <div className={classes.cartWrapper}>
                <div>
                  {/* CART LIST HEADER */}
                  <div className={classes.header}>
                    <p>Products</p>
                    <div className={classes.headerItemDetails}>
                      <p></p>
                      <p></p>
                      <p>Quantity</p>
                    </div>
                    <p className={classes.headersubtotal}>Subtotal</p>
                  </div>
                  {/* CART ITEM LIST */}
                  <ul className={classes.itemsList}>
                    {cart?.items?.map((item, index) => {
                      if (typeof item.product === 'object') {
                        const {
                          quantity,
                          product,
                          product: { id, title, meta, stripeProductID },
                        } = item

                        const isLast = index === (cart?.items?.length || 0) - 1

                        const metaImage = meta?.image

                        return (
                          <CartItem
                            product={product}
                            title={title}
                            metaImage={metaImage}
                            qty={quantity}
                            addItemToCart={addItemToCart}
                            price={product.priceJSON}
                          />
                        )
                      }
                      return null
                    })}
                  </ul>
                </div>
                <div className={classes.summary}>
                  <div className={classes.row}>
                    <h6 className={classes.cartTotal}>Summary</h6>
                  </div>

                  <div className={classes.row}>
                    <p className={classes.cartTotal}>Delivery Charge</p>
                    <p className={classes.cartTotal}>₹0</p>
                  </div>

                  <div className={classes.row}>
                    <p className={classes.cartTotal}>Grand Total</p>
                    <p className={classes.cartTotal}>{cartTotal.formatted}</p>
                  </div>

                  <div className={classes.checkoutButtonWrapper}>
                    {user && addresses.length === 0 && (
                      <p className={classes.checkoutButton}>
                        Please select an address to checkout.
                      </p>
                    )}

                    {user && addresses.length > 0 && selectedAddressIndex >= 0 && (
                      <Button
                        className={classes.checkoutButton}
                        onClick={handleCheckoutClick}
                        href={user ? `/checkout?addressId=${selectedAddressIndex}` : null}
                        label={user ? 'Proceed to Checkout' : 'Login to checkout'}
                      />
                    )}

                    {!user && (
                      <Button
                        className={classes.checkoutButton}
                        onClick={handleCheckoutClick}
                        href={user ? `/checkout?addressId=${selectedAddressIndex}` : null}
                        label={user ? 'Proceed to Checkout' : 'Login to checkout'}
                      />
                    )}
                    {/* {addresses.length > 0 && selectedAddressIndex >= 0 ? (
                      <Button
                        className={classes.checkoutButton}
                        href={
                          user
                            ? `/checkout?addressId=${selectedAddressIndex}`
                            : '/login?redirect=%2Fcheckout'
                        }
                        label={user ? 'Proceed to Checkout' : 'Login to checkout'}
                      />
                    ) : (
                      <p className={classes.warningMessage}>
                        Please select an address to proceed to checkout.
                      </p>
                    )} */}
                    <PhoneLoginModal
                      isOpen={isPhoneLoginModalOpen}
                      onRequestClose={() => setIsPhoneLoginModalOpen(false)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  )
}
