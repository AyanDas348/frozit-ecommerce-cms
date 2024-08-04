import React, { useState } from 'react'
import { FaStar } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { usePathname } from 'next/navigation'

import { useAuth } from '../../_providers/Auth'

import classes from './index.module.scss'

interface RatingStarsProps {
  disabled?: boolean | false
  rating: number
  orderId?: string
  itemId?: string
}

const RatingStars: React.FC<RatingStarsProps> = ({
  disabled = false,
  rating: initialRating,
  orderId,
  itemId,
}) => {
  const [rating, setRating] = useState(initialRating)

  const { user } = useAuth()

  const location = usePathname()

  const handleChangeRating = async (value: number) => {
    if (location === '/orders' && disabled) {
      toast.warning('You can only rate delivered orders', { position: 'top-center' })
      return
    }
    setRating(value)
    const request = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/itemsInventory/ratings?orderId=${orderId}&item_id=${itemId}&rating=${value}`,
      {
        headers: {
          Authorization: user.jwt,
        },
      },
    )
    const response = await request.json()
    if (!response.success) {
      toast.error('Something went wrong', { position: 'top-center' })
    }
  }

  return (
    <div className={classes['star-rating']}>
      {[...Array(5)].map((_, i) => {
        const ratingValue = i + 1
        return (
          <label key={ratingValue} style={{ '--i': ratingValue } as React.CSSProperties}>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              checked={ratingValue === rating}
              onChange={() => handleChangeRating(ratingValue)}
              disabled={disabled && location !== '/orders'}
              className={classes.starInput}
            />
            <FaStar
              className={classes.star}
              color={ratingValue <= rating ? '#ffc107' : '#e4e5e9'}
            />
          </label>
        )
      })}
    </div>
  )
}

export default RatingStars
