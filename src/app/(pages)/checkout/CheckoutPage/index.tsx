'use client'

import React, { Fragment, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import Script from 'next/script'

import { Settings, User } from '../../../../payload/payload-types'
import { Button } from '../../../_components/Button'
import { HR } from '../../../_components/HR'
import { Price } from '../../../_components/Price'
import { useAuth } from '../../../_providers/Auth'
import { useCart } from '../../../_providers/Cart'
import { useTheme } from '../../../_providers/Theme'
import CartItem from '../../cart/CartItem'
import AddressCard from '../AddressCard'
import RazorpayPanel from '../RazorpayPanel'

import 'react-toastify/dist/ReactToastify.css'

import classes from './index.module.scss'
interface OrderIntent {
  addressId: number
  cartId?: string
  quantity?: number
  item_id?: string
  type?: string | 'buy-all'
}

interface Address {
  street: string
  city: string
  state: string
  pinCode: number
  country: string
}

export const CheckoutPage = () => {
  const { user } = useAuth()
  const router = useRouter()
  const [error, setError] = React.useState<string | null>(null)
  const { theme } = useTheme()

  const { cart, cartIsEmpty, cartTotal } = useCart()
  const [orderDetails, setOrderDetails] = useState<OrderIntent>()

  const buyVal = useSearchParams().get('buy')

  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number | null>(-1)
  const addressId = useSearchParams().get('addressId')

  useEffect(() => {
    if (user !== null && cartIsEmpty) {
      // router.push('/cart')
    }
  }, [router, user, cartIsEmpty])

  useEffect(() => {
    const getCart = async () => {
      const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/cart/get-cart`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: user.jwt,
        },
      })
      const data = await req.json()
      return data
    }

    if (user) {
      getCart().then(response => {
        if (response.success) {
          setOrderDetails(prev => {
            return {
              ...prev,
              cartId: response.data.data.cartId,
            }
          })
        }
      })
    }
  }, [user])

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => {
      // Razorpay script loaded
      console.log('Razorpay loaded')
    }
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const createOrderId = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/order/buy-now`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: user.jwt,
        },
        body: JSON.stringify({
          addressId,
          cartId: orderDetails.cartId,
        }),
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()
      return {
        orderId: data.data.data.razorPayOrderId,
        amount: data.data.data.totalPrice,
      }
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error)
    }
  }

  const processPayment = async () => {
    try {
      const { orderId, amount } = await createOrderId()
      const options = {
        key: process.env.RAZORPAY_KEY_ID,
        amount: parseFloat(amount),
        currency: 'INR',
        name: 'Buy Cart',
        description: 'description',
        order_id: orderId,
        handler: async function (response: any) {
          const data = {
            order_id: orderId,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }

          const checkPaymentStatus = async () => {
            const result = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/order/check-status`, {
              method: 'POST',
              body: JSON.stringify(data),
              headers: {
                'Content-Type': 'application/json',
                Authorization: user.jwt,
              },
            })
            const res = await result.json()
            console.log(response)

            if (res.isOk) {
              clearInterval(intervalId)
              alert('Payment succeeded')
            } else {
              console.log('Payment not confirmed yet:', res.message)
            }
          }
          const intervalId = setInterval(checkPaymentStatus, 1000)
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: '#3399cc',
        },
      }
      if (typeof window !== 'undefined' && window.Razorpay) {
        const paymentObject = new window.Razorpay(options)
        paymentObject.on('payment.failed', function (response: any) {
          alert(response.error.description)
        })
        paymentObject.open()
      } else {
        console.error('Razorpay script is not loaded')
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className={classes.checkoutWrapper}>
      <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" />
      {cartIsEmpty && (
        <div>
          {'Your '}
          <Link href="/cart">cart</Link>
          {' is empty.'}
          <Fragment>
            {' '}
            <Link href={`/products`}>Continue shopping?</Link>
          </Fragment>
        </div>
      )}
      {!cartIsEmpty && (
        <div className={classes.cartWrapper}>
          <div>
            {/* CART LIST HEADER */}
            <div className={classes.header}>
              <p>Products</p>
              <div className={classes.headerItemDetails}>
                <p></p>
                <p></p>
                {/* <p>Quantity</p> */}
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
                      price={product.priceJSON}
                      isCheckout={true}
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
              <Button className={classes.checkoutButton} onClick={() => processPayment()}>
                Pay Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
