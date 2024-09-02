import React from 'react'
import { draftMode } from 'next/headers'
import { useSearchParams } from 'next/navigation'

import { Category, Page } from '../../../payload/payload-types'
import { fetchDoc } from '../../_api/fetchDoc'
import { fetchDocs } from '../../_api/fetchDocs'
import { Blocks } from '../../_components/Blocks'
import { Gutter } from '../../_components/Gutter'
import { HR } from '../../_components/HR'
import { defaultCategories } from '../../constants'
import Filters from './Filters'

import classes from './index.module.scss'

const Products = async () => {
  const { isEnabled: isDraftMode } = draftMode()

  let page: Page | null = {
    title: 'Products',
    updatedAt: Date.now().toString(),
    createdAt: Date.now().toString(),
    hero: {
      type: 'lowImpact',
      links: [],
      media: null,
      richText: [],
    },
    id: '',
    layout: [
      {
        introContent: [
          {
            type: 'p',
            children: [
              {
                text: '',
              },
            ],
          },
        ],
        populateBy: 'collection',
        relationTo: 'products',
        categories: [],
        limit: 16,
        id: '1',
        blockName: 'Archive Block',
        blockType: 'archive',
      },
    ],
    slug: 'products',
    meta: {
      title: 'Shop all products',
      description: 'Shop everything from our finest selections',
    },
    _status: 'published',
  }

  let categories: Category[] | null = defaultCategories
  try {
    const request = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/itemsInventory/category`)
    const response = await request.json()
    if (response.success) {
      const data = response.data.data
      categories = data.map(category => ({
        id: category.category_id,
        title: category.category_name,
        media: null,
        updatedAt: Date.now().toString(),
        createdAt: Date.now().toString(),
      }))
    }
  } catch (e) {
    console.log(e)
  }

  return (
    <div className={classes.container}>
      <Gutter className={classes.products}>
        <Filters categories={categories} />
        <Blocks blocks={page?.layout} disableTopPadding={true} />
      </Gutter>
      <HR />
    </div>
  )
}

export default Products
