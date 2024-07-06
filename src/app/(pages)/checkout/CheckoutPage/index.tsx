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

export const CheckoutPage: React.FC<{
  settings: Settings
}> = props => {
  const {
    settings: { productsPage },
  } = props

  const { user } = useAuth()
  const router = useRouter()
  const [error, setError] = React.useState<string | null>(null)
  const { theme } = useTheme()

  const { cart, cartIsEmpty, cartTotal } = useCart()
  const [orderDetails, setOrderDetails] = useState<OrderIntent>()
  const [addresses, setAddresses] = useState<Address[]>([])

  const buyVal = useSearchParams().get('buy')

  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number | null>(-1)

  const [selectedTab, setSelectedTab] = useState(1)

  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    pinCode: '',
    country: '',
    plotNo: '',
  })

  const handleChange = e => {
    const { name, value } = e.target
    setAddress({ ...address, [name]: value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const dataToSend = {
      ...address,
      pinCode: parseInt(address.pinCode),
    }
    console.log(dataToSend)
    const request = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/add-address`, {
      body: JSON.stringify(dataToSend),
      headers: {
        'Content-Type': 'application/json',
        Authorization: user.jwt,
      },
      method: 'POST',
    })
    const response = await request.json()
    console.log(response)
    if (response.success) {
      setAddresses(response.data.data.address)
      setSelectedAddressIndex(response.data.data.address.length - 1)
      setSelectedTab(1)
      setAddress({
        city: '',
        country: '',
        pinCode: '',
        plotNo: '',
        state: '',
        street: '',
      })
    } else {
      toast.error('Something went wrong', {
        position: 'top-center',
      })
    }
  }

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
      getAddresses().then(response => {
        if (response.success && typeof response.data !== 'undefined') {
          setAddresses(response.data.userData.address)
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

  // useEffect(() => {
  //   if (user && cart && hasMadePaymentIntent.current === false) {
  //     hasMadePaymentIntent.current = true

  //     const makeIntent = async () => {
  //       try {
  //         const paymentReq = await fetch(`http://localhost:3000/api/create-payment-intent`, {
  //           method: 'POST',
  //           credentials: 'include',
  //         })

  //         const res = await paymentReq.json()
  //         console.log(res)

  //         if (res.error) {
  //           setError(res.error)
  //         } else if (res.client_secret) {
  //           setError(null)
  //           setClientSecret(res.client_secret)
  //         }
  //       } catch (e) {
  //         setError('Something went wrong.')
  //       }
  //     }

  //     makeIntent()
  //   }
  // }, [cart, user])

  // if (!user) return null

  const handleSelectAddress = (index: number) => {
    setSelectedAddressIndex(index)
  }

  const createOrderId = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/order/buy-now`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: user.jwt,
        },
        body: JSON.stringify({
          addressId: selectedAddressIndex,
          cartId: orderDetails.cartId,
        }),
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()
      console.log(data)
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
          console.log(response)
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

  useEffect(() => {
    if (addresses.length > 0) {
      setSelectedAddressIndex(0)
    } else {
      setSelectedTab(2)
    }
  }, [addresses])

  return (
    <Fragment>
      <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" />
      {cartIsEmpty && (
        <div>
          {'Your '}
          <Link href="/cart">cart</Link>
          {' is empty.'}
          {typeof productsPage === 'object' && productsPage?.slug && (
            <Fragment>
              {' '}
              <Link href={`/${productsPage.slug}`}>Continue shopping?</Link>
            </Fragment>
          )}
        </div>
      )}
      {!cartIsEmpty && (
        <div className={classes.col2}>
          <div className={classes.items}>
            <div className={classes.cartItems}>
              {cart?.items?.map((item, index) => {
                if (typeof item.product === 'object') {
                  const {
                    quantity,
                    product,
                    product: { id, title, meta },
                  } = item

                  if (!quantity) return null

                  const isLast = index === (cart?.items?.length || 0) - 1

                  const metaImage = meta?.image

                  return (
                    <Fragment key={index}>
                      <div className={classes.row}>
                        <div className={classes.rowContent}>
                          <h6 className={classes.title}>{title}</h6>
                          <Price
                            product={product}
                            button={false}
                            quantity={quantity}
                            stock={false}
                          />
                        </div>
                      </div>
                      {!isLast && <HR />}
                    </Fragment>
                  )
                }
                return null
              })}
            </div>
            <div className={classes.orderTotal}>{`Order total: ${cartTotal.raw}`}</div>
          </div>
          <div className={classes.addressColumn}>
            <div className={classes.address}>
              <p
                className={`${classes.selectAddress} ${selectedTab === 1 ? classes.selected : ''}`}
                onClick={() => setSelectedTab(1)}
              >
                Select Address
              </p>
              <p
                className={`${classes.addNewAddress} ${selectedTab === 2 ? classes.selected : ''}`}
                onClick={() => setSelectedTab(2)}
              >
                Add New Address
              </p>
            </div>
            <div className={classes.addressCard}>
              {selectedTab === 1 &&
                addresses.length > 0 &&
                addresses.map((address, index) => (
                  <AddressCard
                    key={index}
                    address={address}
                    index={index}
                    isSelected={index === selectedAddressIndex}
                    onSelect={handleSelectAddress}
                  />
                ))}
            </div>
            {selectedTab === 2 && (
              <form className={classes.form} onSubmit={handleSubmit}>
                <div className={classes.formGroup}>
                  <label htmlFor="plotNo">Plot No:</label>
                  <input
                    type="text"
                    id="plotNo"
                    name="plotNo"
                    value={address.plotNo}
                    onChange={handleChange}
                  />
                </div>
                <div className={classes.formGroup}>
                  <label htmlFor="street">Street:</label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    value={address.street}
                    onChange={handleChange}
                  />
                </div>
                <div className={classes.formGroup}>
                  <label htmlFor="city">City:</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={address.city}
                    onChange={handleChange}
                  />
                </div>
                <div className={classes.formGroup}>
                  <label htmlFor="state">State:</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={address.state}
                    onChange={handleChange}
                  />
                </div>
                <div className={classes.formGroup}>
                  <label htmlFor="pinCode">Pin Code:</label>
                  <input
                    type="number"
                    id="pinCode"
                    name="pinCode"
                    value={address.pinCode}
                    onChange={handleChange}
                  />
                </div>
                <div className={classes.formGroup}>
                  <label htmlFor="country">Country:</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={address.country}
                    onChange={handleChange}
                  />
                </div>
                <Button type="submit" appearance="primary">
                  Submit
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
      <Button type="button" onClick={() => processPayment()} appearance="secondary">
        Pay Now
      </Button>
    </Fragment>
  )
}
