'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'

import { Category, Page, Product } from '../../../payload/payload-types'
import { Button } from '../../_components/Button'
import { Card } from '../../_components/Card'
import { Gutter } from '../../_components/Gutter'
import { Hero } from '../../_components/Hero'
import LoadingScreen from '../../_components/Loader'
import Popup from '../../_components/popup'
import { defaultCategories } from '../../constants'
import { onlineItems } from '../../constants/items'

import classes from './index.module.scss'

export const dynamic = 'force-dynamic'

export default function NewPage({ params: { slug = 'home' } }) {
  const [loading, setLoading] = useState(true)
  // const { hero, layout } = page
  const [categories, setCategories] = useState<Category[] | null>(defaultCategories)
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    ; (async () => {
      const fetchCategories = async () => {
        try {
          // Set loading to true before starting the fetch
          setLoading(true)

          // Fetch banner items
          const bannerReq = await axios.get(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/itemsInventory/banner-item`,
          )
          const images = bannerReq.data.data.data.map(item => item.bannerUrl)
          const ids = bannerReq.data.data.data.map(item => item.itemID)
          setBgImages(images)
          setBgId(ids)

          // Fetch categories
          const categoryReq = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/itemsInventory/category`,
          )
          const categoryRes = await categoryReq.json()
          if (categoryRes.success) {
            const data = categoryRes.data.data.map(category => ({
              id: category.category_id,
              title: category.category_name,
              media: null,
              updatedAt: Date.now().toString(),
              createdAt: Date.now().toString(),
            }))
            setCategories(data)
            setSelectedCategory(data[0].title)
            await handleCategoryChange(data[0])
          }

          // Set loading to false after both banner items and categories are fetched
          setLoading(false)
        } catch (e) {
          console.log(e)
          // In case of error, also set loading to false
          setLoading(false)
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

  const [bgImages, setBgImages] = useState([])
  const [bgId, setBgId] = useState([])

  const mobilebg = [
    '/assets/mobile-banner-images/1_2.jpg',
    '/assets/mobile-banner-images/1_3.jpg',
    '/assets/mobile-banner-images/1.jpg',
    '/assets/mobile-banner-images/3_2.jpg',
    '/assets/mobile-banner-images/4_2.jpg',
  ]

  const [categorizedList, setCategorizedList] = useState<Product[]>()

  const handleCategoryChange = async (category: Category) => {
    setSelectedCategory(category.title)
    const request = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/itemsInventory/get-categories?category_id=${category.id}`,
    )
    const response = await request.json()
    const data = response.data.data.items.map(item => {
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
        priceJSON: item.online_discount
          ? item.rate - item.rate * ((item?.cf_online_discount || 0) / 100)
          : item.rate,
        discount: item.online_discount ? true : false,
        slug: item.item_id,
        stock: item.actual_available_stock,
        cf_online_discount: parseInt(item?.cf_online_discount || 0),
      }
    })
    const discountItem = data.find(item => item.cf_online_discount !== 0)
    setPopupItem(discountItem)
    setCategorizedList(data)
  }

  const [popupItem, setPopupItem] = useState(null)

  const closePopup = () => {
    setPopupItem(null)
  }

  return (
    <React.Fragment>
      {slug === 'home' ? (
        <section className={classes.pageContent}>
          <Popup item={popupItem} onClose={closePopup} />
          <div className={`${classes.loadingScreen} ${!loading ? classes.hide : ''}`}>
            <LoadingScreen />
          </div>
          <div className={`${classes.content} ${loading ? classes.hide : ''}`}>
            <div className={classes.desktopBg}>
              <Hero
                type="customHero"
                richText={[]}
                links={[]}
                media=""
                bgImages={bgImages}
                bgIds={bgId}
              />
            </div>
            <div className={classes.mobileBg}>
              <Hero
                type="customHero"
                richText={[]}
                links={[]}
                media=""
                bgImages={bgImages}
                bgIds={bgId}
              />
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
