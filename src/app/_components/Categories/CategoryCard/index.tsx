'use client'
import React from 'react'
import Link from 'next/link'

import { Category, Media } from '../../../../payload/payload-types'
import { useFilter } from '../../../_providers/Filter'

// import { useFilter } from '../../../_providers/Filter'
import classes from './index.module.scss'

type CategoryCardProps = {
  category: Category
}

const CategoryCard = ({
  category,
  index,
}: {
  category: CategoryCardProps['category']
  index: number
}) => {
  const media = category.media as Media
  const { setCategoryFilters } = useFilter()

  const categoryImages = [
    '/assets/categoryImages/chapati_flour.png',
    '/assets/categoryImages/Cookies_1.png',
    '/assets/categoryImages/Rasiley_1.png',
  ]

  return (
    <Link
      href="/products"
      className={classes.card}
      style={{ backgroundImage: `url(${categoryImages[index]})` }}
      onClick={() => setCategoryFilters([category.id])}
    >
      <p className={classes.title}>{category.title}</p>
    </Link>
  )
}

export default CategoryCard
