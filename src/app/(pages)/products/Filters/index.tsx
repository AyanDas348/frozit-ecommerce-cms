'use client'

import React, { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { Category } from '../../../../payload/payload-types'
import { Checkbox } from '../../../_components/Checkbox'
import { HR } from '../../../_components/HR'
import { RadioButton } from '../../../_components/Radio'
import { useFilter } from '../../../_providers/Filter'

import classes from './index.module.scss'

const Filters = ({ categories }: { categories: Category[] }) => {
  const { categoryFilters, sort, setCategoryFilters, setSort } = useFilter()

  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const setCategory = () => {
      const categoryIdFromQuery = searchParams.get('category_id')
      setCategoryFilters([categoryIdFromQuery])
    }
    setCategory()
  }, [searchParams, setCategoryFilters])

  const handleCategories = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (categoryFilters.includes(categoryId)) {
      // Remove the current filter from the URL
      params.delete('category_id')
      setCategoryFilters([]) // Uncheck and remove all filters
    } else {
      // Set a new category filter in the URL
      params.set('category_id', categoryId)
      setCategoryFilters([categoryId]) // Only select the new category
    }

    // Update the URL with the new search params
    const newUrl = `${window.location.pathname}?${params.toString()}`
    router.push(newUrl)
  }

  const handleSort = (value: string) => setSort(value)

  return (
    <div className={classes.filters}>
      <div>
        <h6 className={classes.title}>Product Categories</h6>
        <div className={classes.categories}>
          {categories.map(category => {
            const isSelected = categoryFilters.includes(category.id)

            return (
              <Checkbox
                key={category.id}
                label={category.title}
                value={category.id}
                isSelected={isSelected}
                onClickHandler={handleCategories}
              />
            )
          })}
        </div>
        <HR className={classes.hr} />
        <h6 className={classes.title}>Sort By</h6>
        <div className={classes.categories}>
          <label className={classes.label}>Price</label>
          <RadioButton
            label="Low to High"
            value="-1"
            isSelected={sort === '-1'}
            onRadioChange={handleSort}
            groupName="sort"
          />
          <RadioButton
            label="High to Low"
            value="1"
            isSelected={sort === '1'}
            onRadioChange={handleSort}
            groupName="sort"
          />
        </div>
      </div>
    </div>
  )
}

export default Filters
