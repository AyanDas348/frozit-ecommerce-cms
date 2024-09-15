'use client'

import React, { Fragment, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Page, Settings, User } from '../../../../payload/payload-types'
import { Button } from '../../../_components/Button'
import { HR } from '../../../_components/HR'
import { Input } from '../../../_components/Input'
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

interface Coupon {
  discountPercentage: any
  id: string
  code: string
  discountType: string
  discountValue: number
  minimumPurchaseAmount: number
  maxDiscountAmount: number
  expiryDate: string
  isActive: boolean
  status: string
  description: string
}

export const CartPage: React.FC<{
  page: Page
}> = props => {
  const { user, firebaseUser } = useAuth()
  const { cart, cartIsEmpty, addItemToCart, cartTotal, hasInitializedCart } = useCart()

  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(() => {
    const storedIndex = localStorage.getItem('selectedAddressIndexFrozit')
    return storedIndex !== null ? JSON.parse(storedIndex) : 0
  })

  const [showChangeAddressModal, setShowChangeAddressModal] = useState(false)
  const [addAddressModal, setAddAddressModal] = useState(false)
  const [isPhoneLoginModalOpen, setIsPhoneLoginModalOpen] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [isCouponApplied, setIsCouponApplied] = useState(false)
  const [discount, setDiscount] = useState(0)
  const [couponError, setCouponError] = useState('')
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [showCoupons, setShowCoupons] = useState(true)
  const [couponDescription, setCouponDescription] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon>(null)
  const router = useRouter()

  useEffect(() => {
    if (user && firebaseUser) {
      const getAddresses = async (): Promise<{ success: boolean; data: User }> => {
        const token = await firebaseUser.getIdToken()
        const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/get-user`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
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
  }, [firebaseUser, user])

  useEffect(() => {
    const fetchCoupons = async () => {
      if (!firebaseUser) return // If no firebaseUser, don't fetch

      try {
        const token = await firebaseUser.getIdToken()
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/order/get-coupon`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!response.ok) {
          throw new Error('Failed to fetch coupons')
        }
        const data = await response.json()
        if (data.data.data && Array.isArray(data.data.data)) {
          setCoupons(data.data.data)
        } else {
          console.error('Unexpected coupon data format:', data)
        }
      } catch (error) {
        console.error('Error fetching coupons:', error)
      }
    }

    fetchCoupons() // Call the function
  }, [firebaseUser]) // Add `firebaseUser` as a dependency

  const handleCheckoutClick = () => {
    if (!user) {
      setIsPhoneLoginModalOpen(true)
    } else {
      router.push(
        `/checkout?addressId=${selectedAddressIndex}&grandTotal=${grandTotalAfterDiscount}`,
      )
    }
  }

  const handleApplyCoupon = () => {
    if (couponCode.trim() === '') {
      setCouponError('Please enter a coupon code')
      return
    }

    const matchedCoupon = coupons.find(
      coupon =>
        coupon.code.toUpperCase() === couponCode.toUpperCase() && coupon.status === 'active',
    )

    if (matchedCoupon) {
      if (matchedCoupon.minimumPurchaseAmount > cartTotal.raw) {
        setCouponError('Minimum purchase amount not met')
        return
      }
      let discountAmount = 0
      if (matchedCoupon.discountType === 'percentage') {
        discountAmount = cartTotal.raw * (matchedCoupon.discountPercentage / 100)
      } else if (matchedCoupon.discountType === 'fixed') {
        discountAmount = matchedCoupon.discountValue
      }

      // Apply minimum and maximum amount constraints
      discountAmount = Math.max(discountAmount, matchedCoupon.maxDiscountAmount)
      handleCouponClick(couponCode.toUpperCase())
      setAppliedCoupon(matchedCoupon)
      setCouponDescription(matchedCoupon.description)
    } else {
      setCouponError('Invalid or inactive coupon code')
      setDiscount(0)
      setIsCouponApplied(false)
    }
  }

  const handleRemoveCoupon = () => {
    setCouponCode('')
    setDiscount(0)
    setIsCouponApplied(false)
    setCouponError('')
  }

  const handleCouponClick = async (code: string) => {
    if (!firebaseUser) return // Ensure user is authenticated

    try {
      // Get the Firebase auth token
      const token = await firebaseUser.getIdToken()

      // Make the API call to apply the coupon
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/order/apply-coupon?code=${code}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      )

      // Check if the response is successful
      if (response.ok) {
        const data = await response.json()
        // Handle the successful coupon application
        if (data.success) {
          setCouponCode(code)
          setDiscount(cartTotal.raw - data.data.data.discountedCartPrice)
          setIsCouponApplied(true)
          setCouponError('')
        } else {
          // If there was an issue with applying the coupon
          setCouponError(data.message || 'Failed to apply coupon')
          setIsCouponApplied(false)
          setDiscount(0)
        }
      } else {
        throw new Error('Failed to apply coupon')
      }
    } catch (error) {
      console.error('Error applying coupon:', error)
      setCouponError('Error applying coupon. Please try again.')
      setIsCouponApplied(false)
      setDiscount(0)
    }
  }

  const grandTotalAfterDiscount = cartTotal.raw - discount

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
                            key={id}
                            product={product}
                            title={title}
                            metaImage={metaImage}
                            qty={quantity}
                            addItemToCart={addItemToCart}
                            price={product.priceJSON}
                            originalPrice={product.originalPriceJSON}
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
                    <p className={classes.cartTotal}>Free</p>
                  </div>

                  {/* Coupon Field */}
                  <div className={classes.couponSection}>
                    {showCoupons && (
                      <div className={classes.couponsList}>
                        <h4>Apply Coupons</h4>
                        {/* <ul>
                          {coupons.map(coupon => (
                            <li key={coupon.id} className={classes.couponItem}>
                              <span className={classes.couponCode}>{coupon.code}</span>
                              <span className={classes.couponDiscount}>
                                {coupon.discountType === 'percentage'
                                  ? `${coupon.discountPercentage}% off`
                                  : `₹${coupon.discountValue} off`}
                              </span>
                              <Button
                                className={classes.applyCouponButton}
                                onClick={() => handleCouponClick(coupon.code)}
                                label="Apply"
                              />
                            </li>
                          ))}
                        </ul> */}
                        <div className={classes.couponSection}>
                          <input
                            name="coupon"
                            value={couponCode}
                            onChange={e => setCouponCode(e.target.value)}
                            className={classes.couponCode}
                          />
                          <Button
                            appearance="secondary"
                            onClick={() => handleApplyCoupon()}
                            label="Apply"
                            type="button"
                          />
                        </div>
                        {couponDescription && (
                          <div className={classes.couponDescription}>
                            <p className={classes.couponMainText}>
                              {couponDescription} upto a maximum of ₹
                              {appliedCoupon.maxDiscountAmount}
                            </p>
                            <p className={classes.couponSubText}>
                              *Offer valid only on minimum purchase amount of ₹
                              {appliedCoupon?.minimumPurchaseAmount || 150}*
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {isCouponApplied && (
                    <div className={classes.row}>
                      <p className={classes.cartTotal}>Discount</p>
                      <p>₹{discount.toFixed(2)}</p>
                    </div>
                  )}

                  <div className={classes.row}>
                    <p className={classes.cartTotal}>Grand Total</p>
                    <p>₹{grandTotalAfterDiscount.toFixed(2)}</p>
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
                        href={
                          user
                            ? `/checkout?addressId=${selectedAddressIndex}&grandTotal=${grandTotalAfterDiscount}`
                            : null
                        }
                        label={user ? 'Proceed to Checkout' : 'Login to checkout'}
                      />
                    )}

                    {!user && (
                      <Button
                        className={classes.checkoutButton}
                        onClick={handleCheckoutClick}
                        href={
                          user
                            ? `/checkout?addressId=${selectedAddressIndex}&grandTotal=${grandTotalAfterDiscount}`
                            : null
                        }
                        label={user ? 'Proceed to Checkout' : 'Login to checkout'}
                      />
                    )}
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
