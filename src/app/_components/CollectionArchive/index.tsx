'use client'

import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'

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
    }, 500)

    const makeRequest = async () => {
      try {
        const req = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/itemsInventory/get-all-items?page=${page}`,
        )
        const json = await req.json()
        clearTimeout(timer)
        hasHydrated.current = true

        // const { docs } = json as { docs: Product[] }
        setResults({
          docs: json.data.data.items.map(item => ({
            categories: [],
            id: item.item_id,
            meta: {
              description: '',
              image: {
                alt: item.image_name,
                caption: null,
                filename: item.image_name,
                height: 2865,
                width: 2200,
                mimeType: item.image_type,
                url: onlineItemsId.includes(item.item_id)
                  ? onlineItems.find(i => i.id === item.item_id).meta.image.url
                  : '',
              },
              title: 'item details',
            },
            priceJSON: item.rate,
            slug: item.item_id,
            title: item.item_name,
            stock: item.actual_available_stock,
          })),
          page: page,
          totalPages: json.data.data.totalPages || 1,
          hasPrevPage: false,
          hasNextPage: json.data.data.currenPage < json.data.data.totalPages ? true : false,
          prevPage: 1,
          nextPage: 1,
          totalDocs: json.data.data.totalItems || 0,
        })
        setIsLoading(false)
      } catch (err) {
        console.warn(err) // eslint-disable-line no-console
        setIsLoading(false)
        // setError(`Unable to load "${relationTo} archive" data at this time.`)
      }
    }

    makeRequest()

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [onlineItemsId, page])

  return (
    <div className={[classes.collectionArchive, className].filter(Boolean).join(' ')}>
      <div ref={scrollRef} className={classes.scrollRef} />
      {isLoading && <LottiePlayer />}
      {!isLoading && error && <div>{error}</div>}
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
    </div>
  )
}
