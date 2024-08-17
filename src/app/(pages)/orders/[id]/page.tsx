'use client'
import React, { useEffect, useState } from 'react'

import { Gutter } from '../../../_components/Gutter'
import { useAuth } from '../../../_providers/Auth'

import classes from './index.module.scss'

export default function Order1({ params: { id } }) {
  const { firebaseUser } = useAuth()
  const [orderDetails, setOrderDetails] = useState(null)

  useEffect(() => {
    const getOrderDetails = async () => {
      const token = await firebaseUser.getIdToken()
      const request = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/order/track-order?shipRocketAwb=${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )
      const response = await request.json()
      setOrderDetails(response.data.data)
    }

    if (firebaseUser) {
      getOrderDetails()
    }
  }, [firebaseUser, id])

  return (
    <Gutter className={classes.orders}>
      <iframe
        src={orderDetails?.track_url}
        className={classes.orderDetails}
        style={{
          width: '100%',
          height: '115vh',
          border: 'none',
          overflow: 'hidden',
        }}
        scrolling="no"
      />
    </Gutter>
  )
}
