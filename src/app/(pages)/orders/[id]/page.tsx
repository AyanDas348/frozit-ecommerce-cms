import React, { Fragment } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Order } from '../../../../payload/payload-types'
import { Button } from '../../../_components/Button'
import { Gutter } from '../../../_components/Gutter'
import { HR } from '../../../_components/HR'
import { Media } from '../../../_components/Media'
import { Price } from '../../../_components/Price'
import { formatDateTime } from '../../../_utilities/formatDateTime'
import { getMeUser } from '../../../_utilities/getMeUser'
import { mergeOpenGraph } from '../../../_utilities/mergeOpenGraph'

import classes from './index.module.scss'

export default async function Order1({ params: { id } }) {
  const { token } = await getMeUser({
    nullUserRedirect: `/login?error=${encodeURIComponent(
      'You must be logged in to view this order.',
    )}&redirect=${encodeURIComponent(`/order/${id}`)}`,
  })

  let order: Order | null = null

  try {
    order = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${token}`,
      },
    })?.then(async res => {
      if (!res.ok) notFound()
      const json = await res.json()
      if ('error' in json && json.error) notFound()
      if ('errors' in json && json.errors) notFound()
      return json
    })
  } catch (error) {
    console.error(error) // eslint-disable-line no-console
  }

  if (!order) {
    notFound()
  }

  return (
    <Gutter className={classes.orders}>
      <h1>
        {`Order`}
        <span className={classes.id}>{`${order._id}`}</span>
      </h1>
      <div className={classes.itemMeta}>
        <p>{`ID: ${order._id}`}</p>
        <p>{`Payment Intent: ${order.stripePaymentIntentID}`}</p>
        <p>{`Ordered On: ${formatDateTime(order.createdAt)}`}</p>
        <p className={classes.total}>
          {'Total: '}
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'usd',
          }).format(order.totalPrice / 100)}
        </p>
      </div>
      <HR />
      <div className={classes.order}>
        <h4 className={classes.orderItems}>Items</h4>
        {order.orderItems?.map((item, index) => {
          return null
        })}
      </div>
      <HR />
      <div className={classes.actions}>
        <Button href="/orders" appearance="primary" label="See all orders" />
        <Button href="/account" appearance="secondary" label="Go to account" />
      </div>
    </Gutter>
  )
}

export async function generateMetadata({ params: { id } }): Promise<Metadata> {
  return {
    title: `Order ${id}`,
    description: `Order details for order ${id}.`,
    openGraph: mergeOpenGraph({
      title: `Order ${id}`,
      url: `/orders/${id}`,
    }),
  }
}
