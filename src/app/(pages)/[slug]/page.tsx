'use client'

import React, { useEffect, useState } from 'react'
import { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'

import { Category, Page } from '../../../payload/payload-types'
import { staticHome } from '../../../payload/seed/home-static'
import { fetchDoc } from '../../_api/fetchDoc'
import { fetchDocs } from '../../_api/fetchDocs'
import { Blocks } from '../../_components/Blocks'
import { Card } from '../../_components/Card'
import Categories from '../../_components/Categories'
import { Gutter } from '../../_components/Gutter'
import { Hero } from '../../_components/Hero'
import { LoadingShimmer } from '../../_components/LoadingShimmer'
import Loader from '../../_components/LottiePlayer'
import { generateMeta } from '../../_utilities/generateMeta'
import { defaultCategories } from '../../constants'
import { onlineItems } from '../../constants/items'

import classes from './index.module.scss'

export const dynamic = 'force-dynamic'

export default function NewPage({ params: { slug = 'home' } }) {
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState<Page | null>(null)
  const [categories, setCategories] = useState<Category[] | null>(defaultCategories)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedPage = await fetchDoc<Page>({ collection: 'pages', slug })
        setPage(fetchedPage)
        // categories = await fetchDocs<Category>('categories')
      } catch (error) {
        console.error(error)
      }

      if (!page && slug === 'home') {
        setPage(staticHome)
      }

      setLoading(false)
    }

    fetchData()

    // Show shimmer for 5 seconds
    const timer = setTimeout(() => setLoading(false), 5000)

    // Cleanup timer on component unmount
    return () => clearTimeout(timer)
  }, [slug, page])

  if (loading) {
    return <Loader />
  }

  const { hero, layout } = page

  let richText = [
    {
      children: [
        {
          text: 'Time Ki Bachat,',
        },
      ],
      type: 'h2',
    },
    {
      children: [
        {
          text: 'Eat Fresh Fatafat',
        },
      ],
      type: 'h2',
    },
    {
      children: [
        {
          text: '\nProviding you Ready to Eat Frozen Foods, ',
        },
      ],
    },
    {
      children: [
        {
          text: 'Fresh & Packed Delectable Bakery products,',
        },
      ],
    },
    {
      children: [
        {
          text: 'Refreshing Drinks and much more',
        },
      ],
    },
  ]

  const premiumProductsNames = [
    'chana sattu',
    'chuda powder',
    'daliya',
    'rusk',
    'olive',
    'punjabi',
    'idili',
    'ragi',
    'sagoo',
    'sattu',
    'muffin',
    'custard',
    'corn flour',
    'soya roll',
  ]

  const beverages = ['pineapple', 'litchi', 'icy', 'ripe']

  const premiumProductsList = onlineItems.filter(item =>
    premiumProductsNames.some(name => item.title.toLowerCase().includes(name))) // eslint-disable-line

  const beveragesList = onlineItems.filter(item =>
    beverages.some(name => item.title.toLowerCase().includes(name)),)

  const dektopBg = [
    '/assets/banners/1_1.jpg',
    '/assets/banners/1_3.jpg',
    '/assets/banners/1.jpg',
    '/assets/banners/3.jpg',
    '/assets/banners/4.jpg',
  ]

  const mobilebg = [
    '/assets/mobile-banner-images/1_2.jpg',
    '/assets/mobile-banner-images/1_3.jpg',
    '/assets/mobile-banner-images/1.jpg',
    '/assets/mobile-banner-images/3_2.jpg',
    '/assets/mobile-banner-images/4_2.jpg',
  ]

  return (
    <React.Fragment>
      {slug === 'home' ? (
        <section>
          {loading && <Loader />}
          <div className={classes.desktopBg}>
            <Hero type="customHero" richText={richText} links={[]} media="" bgImages={dektopBg} />
          </div>
          <div className={classes.mobileBg}>
            <Hero type="customHero" richText={[]} links={[]} media="" bgImages={mobilebg} />
          </div>
          <Gutter>
            <label className={classes.sectionHeading}>
              Beat the heat with our curated beverages
            </label>
          </Gutter>
          <Gutter>
            {/* <Categories categories={categories} /> */}
            <div className={classes.onlineItems}>
              {beveragesList
                ?.map(item => {
                  return { ...item, priceJSON: parseInt(item.priceJSON) }
                })
                ?.map((result, index) => {
                  return <Card key={index} relationTo="products" doc={result} showCategories />
                })}
            </div>
          </Gutter>
          <Gutter>{''}</Gutter>
          <Hero
            type="customHero"
            richText={[]}
            links={[]}
            media=""
            bgImages={['/assets/banners/2.jpg']}
          />
          <Gutter>
            <label className={classes.sectionHeading}>Explore some of our Premium Products</label>
          </Gutter>
          <Gutter>
            {/* <Categories categories={categories} /> */}
            <div className={classes.onlineItems}>
              {onlineItems
                ?.map(item => {
                  return { ...item, priceJSON: parseInt(item.priceJSON) }
                })
                ?.map((result, index) => {
                  return <Card key={index} relationTo="products" doc={result} showCategories />
                })}
            </div>
          </Gutter>
        </section>
      ) : (
        <>
          <Hero {...hero} />
          <Blocks
            blocks={layout}
            disableTopPadding={!hero || hero?.type === 'none' || hero?.type === 'lowImpact'}
          />
        </>
      )}
    </React.Fragment>
  )
}
