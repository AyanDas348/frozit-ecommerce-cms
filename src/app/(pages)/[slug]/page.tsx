'use client'

import React, { useEffect, useState } from 'react'

import { Category, Page, Product } from '../../../payload/payload-types'
import { Button } from '../../_components/Button'
import { Card } from '../../_components/Card'
import { Gutter } from '../../_components/Gutter'
import { Hero } from '../../_components/Hero'
import LoadingScreen from '../../_components/Loader'
import { defaultCategories } from '../../constants'
import { onlineItems } from '../../constants/items'

import classes from './index.module.scss'

export const dynamic = 'force-dynamic'

export default function NewPage({ params: { slug = 'home' } }) {
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState<Page | null>(null)
  // const { hero, layout } = page
  const [categories, setCategories] = useState<Category[] | null>(defaultCategories)
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    ; (async () => {
      const fetchCategories = async () => {
        try {
          const request = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/itemsInventory/category`,
          )
          const response = await request.json()
          if (response.success) {
            const data = response.data.data.map(category => ({
              id: category.category_id,
              title: category.category_name,
              media: null,
              updatedAt: Date.now().toString(),
              createdAt: Date.now().toString(),
            }))
            setCategories(data)
            setSelectedCategory(data[0].title)
            await handleCategoryChange(data[0])
            setLoading(false)
          }
        } catch (e) {
          console.log(e)
        }
      }
      fetchCategories()
    })()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 3000)

    // Cleanup the timer if the component unmounts before the timeout is reached
    return () => clearTimeout(timer)
  }, [])

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
  ]

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

  const beverages = ['COOKIES']

  const onlineItemsId = onlineItems.map(item => item.id)

  const premiumProductsList = onlineItems.filter(item =>
    premiumProductsNames.some(name => item.title.toLowerCase().includes(name))) // eslint-disable-line

  const cookiesList = onlineItems
    .filter(item => item.title.toLowerCase().includes('cookies'))
    .map(item => {
      return {
        ...item,
        priceJSON: parseInt(item.priceJSON),
        rating: 4,
      }
    })

  const [categorizedList, setCategorizedList] = useState<Product[]>()

  const handleCategoryChange = async (category: Category) => {
    setSelectedCategory(category.title)
    const request = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/itemsInventory/get-categories?category_id=${category.id}`,
    )
    const response = await request.json()
    setCategorizedList(
      response.data.data.items.map(item => {
        return {
          id: item.item_id,
          title: item.name,
          meta: {
            description: '',
            image: {
              alt: item.image_name,
              caption: null,
              filename: item.image_name,
              height: 2865,
              width: 2200,
              mimeType: item.image_type,
              url: item.imageUrls[0],
              urls: item.imageUrls,
            },
            title: 'item details',
          },
          originalPriceJSON: item.rate,
          priceJSON: item.online_discount ? (item.rate - (item.rate * (item.cf_online_discount / 100))) : item.rate,
          discount: item.online_discount ? true : false,
          slug: item.item_id,
          stock: item.actual_available_stock,
        }
      }),
    )
  }

  return (
    <React.Fragment>
      {slug === 'home' ? (
        <section className={classes.pageContent}>
          <div className={`${classes.loadingScreen} ${!loading ? classes.hide : ''}`}>
            <LoadingScreen />
          </div>
          <div className={`${classes.content} ${loading ? classes.hide : ''}`}>
            <div className={classes.desktopBg}>
              <Hero type="customHero" richText={[]} links={[]} media="" bgImages={dektopBg} />
            </div>
            <div className={classes.mobileBg}>
              <Hero type="customHero" richText={[]} links={[]} media="" bgImages={mobilebg} />
            </div>
            <Gutter>
              <label className={classes.sectionHeading}>
                Choose from our varied range of products
              </label>
              <p className={classes.sectionText}>
                Our company specializes in producing a range of healthy and nutritious food
                products, including frozen ready-to-eat meals, instant mixes, and beverages, using
                advanced German technology. We have a strong presence in the Indian market, where
                our products hold a leading position. We are dedicated to providing fresh,
                wholesome, and delicious foods, with each packet embodying our passion, dedication,
                and hard work.
              </p>
              <ul className={classes.radioInputs}>
                {categories?.map(category => (
                  <li key={category.id} className={classes.radio}>
                    <Button
                      type="button"
                      appearance={selectedCategory === category.title ? 'primary' : 'secondary'}
                      onClick={() => {
                        handleCategoryChange(category)
                      }}
                    >
                      {category.title}
                    </Button>
                  </li>
                ))}
              </ul>
            </Gutter>
            <Gutter>
              {/* <Categories categories={categories} /> */}
              <div className={classes.onlineItems}>
                {categorizedList
                  ?.map(item => {
                    return {
                      ...item,
                      priceJSON:
                        typeof item.priceJSON === 'number'
                          ? item.priceJSON
                          : parseInt(item.priceJSON),
                    }
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
          </div>
        </section>
      ) : (
        <>
          {/* <Hero {...hero} />
          <Blocks
            blocks={layout}
            disableTopPadding={!hero || hero?.type === 'none' || hero?.type === 'lowImpact'}
          /> */}
        </>
      )}
    </React.Fragment>
  )
}
