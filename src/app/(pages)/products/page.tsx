import React from 'react'
import { draftMode } from 'next/headers'

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
      richText: [
        {
          type: 'h1',
          children: [
            {
              text: 'All products',
            },
          ],
        },
        {
          type: 'p',
          children: [
            {
              text: 'View Products',
            },
          ],
        },
      ],
      links: [],
      media: null,
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
        limit: 10,
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
