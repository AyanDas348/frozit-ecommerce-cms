'use client'

import React, { Fragment, useEffect, useState } from 'react'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'

import { Product } from '../../../payload/payload-types'
import { Media } from '../Media'
import { Price } from '../Price'

import classes from './index.module.scss'

// const priceFromJSON = (priceJSON): string => {
//   let price = ''

//   if (priceJSON) {
//     try {
//       const parsed = JSON.parse(priceJSON)?.data[0]
//       const priceValue = parsed.unit_amount
//       const priceType = parsed.type
//       price = `${parsed.currency === 'usd' ? '$' : ''}${(priceValue / 100).toFixed(2)}`
//       if (priceType === 'recurring') {
//         price += `/${
//           parsed.recurring.interval_count > 1
//             ? `${parsed.recurring.interval_count} ${parsed.recurring.interval}`
//             : parsed.recurring.interval
//         }`
//       }
//     } catch (e) {
//       console.error(`Cannot parse priceJSON`) // eslint-disable-line no-console
//     }
//   }

//   return price
// }

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  showCategories?: boolean
  hideImagesOnMobile?: boolean
  title?: string
  relationTo?: 'products'
  doc?: Product
}> = props => {
  const {
    showCategories,
    title: titleFromProps,
    doc,
    doc: { slug, title, categories, meta, priceJSON } = {},
    className,
  } = props

  const { description, image: metaImage } = meta || {}
  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/products/${slug}`

  const [
    price, // eslint-disable-line no-unused-vars
    setPrice,
  ] = useState(priceJSON)

  // useEffect(() => {
  //   ; (async () => {
  //     if (typeof metaImage !== 'string' && metaImage.url !== '') {
  //       const response = await axios.get(
  //         `https://inventory.zoho.in/DocTemplates_ItemImage_${metaImage.url}.zbfs?organization_id=60029131613`,
  //         {
  //           headers: {
  //             Accept: '*',
  //             'Accept-Encoding': 'gzip, deflate, br, zstd',
  //             'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
  //             'Cache-Control': 'max-age=0',
  //             Connection: 'keep-alive',
  //             'Cookie':
  //               'zohocares-_zldp=YfEOFpfOAG%2Bzw8FpYT7O5hK4ZHd2NEXoEI%2BxyXUXWpKVT06IK%2B%2Bd2oSwXyvwAGHaRFoW6QbcsZk%3D; zohocares-_uuid=fe8567e5-9d4c-4152-8d92-5a8959d0ddc8_d306; BuildCookie_AssetType=modern; showEditorLeftPane=undefined; zohocares-_zldp=YfEOFpfOAG%2Bzw8FpYT7O5hK4ZHd2NEXoEI%2BxyXUXWpKVT06IK%2B%2Bd2oSwXyvwAGHaRFoW6QbcsZk%3D; zohocares-_uuid=fe8567e5-9d4c-4152-8d92-5a8959d0ddc8_d306; _iamadt=fef647af07abcc9c17e15222dec7ba488052f967a1225e97bf9faee1f1275e09779b2642d87619778c3e0768f9d00643dec9ca0c07e3803712056638a90d49af; _iambdt=c1bfeaa04b99217cea4f9045566c640d853f273ee6b23d60e15779e69fd8f7f1452863bc6724c14f50969dfa45bb181e0c1ae477b69f56ddfe351f825563cc92; zohocares-_zldt=2106ac0d-c934-434f-8d67-1752385fb880-2; zalb_3241fad02e=10ad72df26b72479c6e9178d52e3b9f7; zomcscook=01f82bd5a0ef3a8259de0f05d5c449ab546759fcf3d7504254683a9b95b69983505ac10d3bb0b9a6d5c55c8dfe9d79a27bd50d997beb910ec45fe44a9cf781c0; _zcsr_tmp=01f82bd5a0ef3a8259de0f05d5c449ab546759fcf3d7504254683a9b95b69983505ac10d3bb0b9a6d5c55c8dfe9d79a27bd50d997beb910ec45fe44a9cf781c0; JSESSIONID=AFC82C6076C7C9FF0ECD7354007A80A9',
  //             Host: 'inventory.zoho.in',
  //             'Sec-Fetch-Dest': 'document',
  //             'Sec-Fetch-Mode': 'navigate',
  //             'Sec-Fetch-Site': 'none',
  //             'Sec-Fetch-User': '?1',
  //             // 'Upgrade-Insecure-Requests': '1',
  //             Referer: 'https://google.com',
  //           },
  //         },
  //       )

  //       console.log(response)

  //       if (!response.status) {
  //         throw new Error('Network response was not ok')
  //       }
  //     }
  //   })()
  // }, [metaImage])

  return (
    <Link href={href} className={[classes.card, className].filter(Boolean).join(' ')}>
      <div className={classes.mediaWrapper}>
        {!metaImage && <div className={classes.placeholder}>No image</div>}
        {metaImage && typeof metaImage !== 'string' && (
          <Media className={classes.image} resource={metaImage} fill />
        )}
      </div>
      <div className={classes.content}>
        {titleToUse && <h4 className={classes.title}>{titleToUse}</h4>}
        {description && (
          <div className={classes.body}>
            {description && <p className={classes.description}>{sanitizedDescription}</p>}
          </div>
        )}
        {doc && <Price product={doc} />}
      </div>
    </Link>
  )
}
