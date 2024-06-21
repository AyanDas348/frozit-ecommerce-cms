'use client'
import React, { useEffect, useState } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Order } from '../../../payload/payload-types'
import { Button } from '../../_components/Button'
import { Gutter } from '../../_components/Gutter'
import { HR } from '../../_components/HR'
import { RenderParams } from '../../_components/RenderParams'
import { useAuth } from '../../_providers/Auth'
import { formatDateTime } from '../../_utilities/formatDateTime'
import { getMeUser } from '../../_utilities/getMeUser'
import { mergeOpenGraph } from '../../_utilities/mergeOpenGraph'

import classes from './index.module.scss'

export default function Orders() {
  // const { token } = await getMeUser({
  //   nullUserRedirect: `/login?error=${encodeURIComponent(
  //     'You must be logged in to view your orders.',
  //   )}&redirect=${encodeURIComponent('/orders')}`,
  // })

  const { user } = useAuth()
  console.log(user)

  const [orders, setOrders] = useState<Order[] | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `JWT ${''}`, // Replace with actual token logic
          },
          cache: 'no-store',
        })

        if (!response.ok) {
          notFound()
          return
        }

        const json = await response.json()
        if ('error' in json && json.error) {
          notFound()
          return
        }
        if ('errors' in json && json.errors) {
          notFound()
          return
        }

        setOrders(json.docs)
      } catch (error) {
        console.error(error)
        notFound()
      }
    }

    fetchOrders()
  }, [])

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '33%' }}>
        <p></p>
      </div>
      <div className={classes.orders} style={{ width: '66%' }}>
        <h1>Orders</h1>
        {(!orders || !Array.isArray(orders) || orders?.length === 0) && (
          <p className={classes.noOrders}>You have no orders.</p>
        )}
        <RenderParams />
        {orders && orders.length > 0 && (
          <ul className={classes.ordersList}>
            {orders?.map((order, index) => (
              <li key={order.id} className={classes.listItem}>
                <Link className={classes.item} href={`/orders/${order.id}`}>
                  <div className={classes.itemContent}>
                    <h4 className={classes.itemTitle}>{`Order ${order.id}`}</h4>
                    <div className={classes.itemMeta}>
                      <p>{`Ordered On: ${formatDateTime(order.createdAt)}`}</p>
                      <p>
                        {'Total: '}
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'usd',
                        }).format(order.total / 100)}
                      </p>
                    </div>
                  </div>
                  <Button
                    appearance="secondary"
                    label="View Order"
                    className={classes.button}
                    el="button"
                  />
                </Link>
                {/* {index !== orders.length - 1 && <HR />} */}
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
