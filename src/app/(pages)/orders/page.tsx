'use client'
import React, { useEffect, useState } from 'react'
import { UserCircle2 } from 'lucide-react'
import { notFound } from 'next/navigation'

import { Order } from '../../../payload/payload-types'
import { HR } from '../../_components/HR'
import RatingStars from '../../_components/Rating'
import { RenderParams } from '../../_components/RenderParams'
import { useAuth } from '../../_providers/Auth'
import { formatDateTime } from '../../_utilities/formatDateTime'

import classes from './index.module.scss'

export default function Orders() {
  // const { token } = await getMeUser({
  //   nullUserRedirect: `/login?error=${encodeURIComponent(
  //     'You must be logged in to view your orders.',
  //   )}&redirect=${encodeURIComponent('/orders')}`,
  // })

  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[] | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/order/get-all-orders`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: user.jwt,
          },
          cache: 'no-store',
        })

        const json = await response.json()

        setOrders(json.data.data)
      } catch (error) {
        console.error(error)
        notFound()
      }
    }
    if (user) {
      fetchOrders()
    }
  }, [user])

  console.log(orders)

  return (
    <div className={classes.mainContainer}>
      <div className={classes.account}>
        <p>
          <UserCircle2 />
        </p>
      </div>
      <div className={classes.orders}>
        <h1>Orders</h1>
        {(!orders || !Array.isArray(orders) || orders?.length === 0) && (
          <p className={classes.noOrders}>You have no orders.</p>
        )}
        <RenderParams />
        {orders && orders.length > 0 && (
          <ul className={classes.ordersList}>
            {orders?.map((order, index) => (
              <li key={order._id} className={classes.listItem}>
                <div className={classes.item}>
                  <div className={classes.itemContent}>
                    <h4 className={classes.itemTitle}>{`Order #${index + 1}`}</h4>
                    <ul>
                      {order.orderItems.map(item => {
                        return (
                          <li className={classes.starContainer}>
                            {item.itemName || ''} {`(${item.quantity})`}
                            <RatingStars
                              rating={item.rating}
                              itemId={item.itemId}
                              orderId={order._id}
                              disabled={order.status !== 'delivered'}
                            />
                          </li>
                        )
                      })}
                    </ul>
                    <div className={classes.itemMeta}>
                      <p>{`Ordered On: ${formatDateTime(order.createdAt)}`}</p>
                      <p>
                        {'Total: '}
                        {order.totalPrice.toLocaleString('en-IN', {
                          style: 'currency',
                          currency: 'INR',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
                <HR />
              </li>
            ))}
          </ul>
        )}
        {/* <HR /> */}
      </div>
    </div>
  )
}

// export const metadata: Metadata = {
//   title: 'Orders',
//   description: 'Your orders.',
//   openGraph: mergeOpenGraph({
//     title: 'Orders',
//     url: '/orders',
//   }),
// }
