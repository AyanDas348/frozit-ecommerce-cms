'use client'

import React, { useEffect, useState } from 'react'

import classes from './index.module.scss'

interface HeroClientProps {
  bgImages: string[]
}

const HeroClient: React.FC<HeroClientProps> = ({ bgImages }) => {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (bgImages.length > 1) {
      const interval = setInterval(() => {
        setIndex(prevIndex => (prevIndex + 1) % bgImages.length)
      }, 5000) // Change image every 5 seconds
      return () => clearInterval(interval)
    }
  }, [bgImages.length])

  return (
    <div className={classes.heroWrapper} style={{ backgroundImage: `url(${bgImages[index]})` }} />
  )
}

export default HeroClient
