'use client'

import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'

import { Category, Product } from '../../../payload/payload-types'
import type { ArchiveBlockProps } from '../../_blocks/ArchiveBlock/types'
import { useFilter } from '../../_providers/Filter'
import { onlineItems } from '../../constants/items'
import { Card } from '../Card'
import LottiePlayer from '../LottiePlayer'
import { PageRange } from '../PageRange'
import { Pagination } from '../Pagination'

import classes from './index.module.scss'

type Result = {
  totalDocs: number
  docs: Product[]
  page: number
  totalPages: number
  hasPrevPage: boolean
  hasNextPage: boolean
  nextPage: number
  prevPage: number
}

export type Props = {
  className?: string
  relationTo?: 'products'
  populateBy?: 'collection' | 'selection'
  showPageRange?: boolean
  onResultChange?: (result: Result) => void // eslint-disable-line no-unused-vars
  limit?: number
  populatedDocs?: ArchiveBlockProps['populatedDocs']
  populatedDocsTotal?: ArchiveBlockProps['populatedDocsTotal']
  categories?: ArchiveBlockProps['categories']
}

export const CollectionArchive: React.FC<Props> = props => {
  const { categoryFilters, sort } = useFilter()

  const {
    className,
    relationTo,
    showPageRange,
    onResultChange,
    limit = 10,
    // populatedDocs,
    // populatedDocsTotal,
  } = props

  const [results, setResults] = useState<Result>({
    totalDocs: 0,
    docs: [],
    page: 1,
    totalPages: 1,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: 1,
    nextPage: 1,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const scrollRef = useRef<HTMLDivElement>(null)
  const hasHydrated = useRef(false)
  const [page, setPage] = useState(1)

  const scrollToRef = useCallback(() => {
    const { current } = scrollRef
    if (current) {
      current.scrollIntoView({
        behavior: 'smooth',
      })
    }
  }, [])

  const onlineItemsId = onlineItems.map(item => item.id)
  useEffect(() => {
    if (!isLoading && typeof results.page !== 'undefined') {
      // scrollToRef()
    }
  }, [isLoading, scrollToRef, results])

  useEffect(() => {
    // hydrate the block with fresh content after first render
    // don't show loader unless the request takes longer than x ms
    // and don't show it during initial hydration

    const timer: NodeJS.Timeout = setTimeout(() => {
      if (hasHydrated) {
        setIsLoading(true)
      }
    })

    // Set isLoading to false after 5 seconds regardless of the request state
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    return () => {
      clearTimeout(timer)
      clearTimeout(loadingTimeout)
    }
  }, [])

  const [newResult, setNewResults] = useState<Product[]>([])
  const searchParams = useSearchParams()

  useEffect(() => {
    // if (initialRender.current) {
    //   initialRender.current = false
    //   return // Skip the first render
    // }

    const makeRequest = async () => {
      try {
        const categoryFilterPresent = categoryFilters.length > 0
        let response
        const categoryIdFromQuery = searchParams.get('category_id')
        const newArrivalQuery = searchParams.get('new_arrival')

        if (categoryIdFromQuery && !newArrivalQuery) {
          const request = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/itemsInventory/get-categories?category_id=${categoryIdFromQuery}&priceOrder=${sort}`,
          )
          response = await request.json()
          const docs = response.data.data.items.map(item => ({
            categories: item.category_id || '1697951000000336031',
            id: item.item_id,
            meta: {
              description: item.description || '',
              ingredients: item?.cf_ingredients ?? '',
              image: {
                alt: item.image_name || '',
                caption: null,
                filename: item.image_name || '',
                height: 2865,
                width: 2200,
                mimeType: item.image_type || '',
                urls: (item.imageUrls || []).length > 0 ? item.imageUrls : [],
                url: item.imageUrls[0],
              },
              title: 'item details',
            },
            priceJSON: item.online_discount
              ? item.rate - item.rate * ((item.cf_online_discount || 0) / 100)
              : item.rate,
            originalPriceJSON: item.rate,
            slug: item.item_id,
            title: item.item_name || '',
            stock: item.actual_available_stock || 0,
          }))

          setNewResults(docs)

          setResults({
            docs,
            page: page,
            totalPages: response.data.data.totalPages || 1,
            hasPrevPage: false,
            hasNextPage:
              response?.data?.data?.currentPage < response?.data?.data?.totalPages ? true : false,
            prevPage: 1,
            nextPage: 1,
            totalDocs: response?.data?.data?.totalItems || response?.data?.data?.items.length,
          })
        } else if (newArrivalQuery === 'true') {
          const request = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/itemsInventory/new-arrival`,
          )
          response = await request.json()
          const docs = response.data.data.map(item => ({
            categories: item.category_id || '1697951000000336031',
            id: item.item_id,
            meta: {
              description: item.description || '',
              ingredients: item?.cf_ingredients ?? '',
              image: {
                alt: item.image_name || '',
                caption: null,
                filename: item.image_name || '',
                height: 2865,
                width: 2200,
                mimeType: item.image_type || '',
                urls: (item.imageUrls || []).length > 0 ? item.imageUrls : [],
                url: item.imageUrls[0],
              },
              title: 'item details',
            },
            priceJSON: item.online_discount
              ? item.rate - item.rate * ((item.cf_online_discount || 0) / 100)
              : item.rate,
            originalPriceJSON: item.rate,
            slug: item.item_id,
            title: item.item_name || '',
            stock: item.actual_available_stock || 0,
          }))

          setNewResults(docs)

          setResults({
            docs,
            page: page,
            totalPages: response.data.data.totalPages || 1,
            hasPrevPage: false,
            hasNextPage:
              response?.data?.data?.currentPage < response?.data?.data?.totalPages ? true : false,
            prevPage: 1,
            nextPage: 1,
            totalDocs: response?.data?.data?.totalItems || response?.data?.data?.length,
          })
        } else {
          const req = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/itemsInventory/get-all-items?page=${page}&priceOrder=${sort}`,
          )
          response = await req.json()
          const docs = response.data.data.items.map(item => ({
            categories: item.category_id || '1697951000000336031',
            id: item.item_id,
            meta: {
              description: item.description || '',
              ingredients: item?.cf_ingredients ?? '',
              image: {
                alt: item.image_name || '',
                caption: null,
                filename: item.image_name || '',
                height: 2865,
                width: 2200,
                mimeType: item.image_type || '',
                urls: (item.imageUrls || []).length > 0 ? item.imageUrls : [],
                url: item.imageUrls[0],
              },
              title: 'item details',
            },
            priceJSON: item.online_discount
              ? item.rate - item.rate * ((item.cf_online_discount || 0) / 100)
              : item.rate,
            originalPriceJSON: item.rate,
            slug: item.item_id,
            title: item.item_name || '',
            stock: item.actual_available_stock || 0,
          }))

          setNewResults(docs)

          setResults({
            docs,
            page: page,
            totalPages: response.data.data.totalPages || 1,
            hasPrevPage: false,
            hasNextPage:
              response?.data?.data?.currentPage < response?.data?.data?.totalPages ? true : false,
            prevPage: 1,
            nextPage: 1,
            totalDocs: response?.data?.data?.totalItems || response?.data?.data?.items.length,
          })
        }
        // clearTimeout(timer)
        hasHydrated.current = true
      } catch (err) {
        console.warn(err)
        setIsLoading(false)
      }
    }

    makeRequest()
  }, [categoryFilters, page, searchParams, sort])

  const initialRender = useRef(true)

  return (
    <div className={[classes.collectionArchive, className].filter(Boolean).join(' ')}>
      <div ref={scrollRef} className={classes.scrollRef} />
      {isLoading && <LottiePlayer />}
      {!isLoading && error && <div>{error}</div>}
      {!isLoading && (
        <Fragment>
          {showPageRange !== false && (
            <div className={classes.pageRange}>
              <PageRange
                totalDocs={results.totalDocs}
                currentPage={results.page}
                collection={relationTo}
                limit={limit}
              />
            </div>
          )}

          <div className={classes.grid}>
            {results.docs?.map((result, index) => {
              return <Card key={index} relationTo="products" doc={result} showCategories />
            })}
          </div>

          {results.totalPages > 1 && (
            <Pagination
              className={classes.pagination}
              page={results.page}
              totalPages={results.totalPages}
              onClick={setPage}
            />
          )}
        </Fragment>
      )}
    </div>
  )
}
