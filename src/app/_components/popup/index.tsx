'use client'
import React, { useEffect, useState } from 'react'
import { X } from 'lucide-react'

import { Button } from '../Button'

import styles from './index.module.scss'

const Popup = ({ item, onClose }) => {
  if (!item) return null

  const { meta, title, rate, cf_online_discount, originalPriceJSON, id } = item

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <button onClick={onClose} className={styles.closeButton}>
          <X />
        </button>
        <div className={styles.imageContainer}>
          <img src={meta.image.url} alt={title} className={styles.image} />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'left',
            }}
          >
            <h3 className={styles.title}>{title}</h3>
            <p>INR {originalPriceJSON}</p>
            <h5>{cf_online_discount}% OFF</h5>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            width: '100%',
          }}
        >
          <Button appearance="primary" href={`/products/${id}`} className={styles.buy}>
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Popup
