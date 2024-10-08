'use client'

import React from 'react'
import NextImage, { StaticImageData } from 'next/image'

import cssVariables from '../../../cssVariables'
import { Props as MediaProps } from '../types'

import classes from './index.module.scss'

const { breakpoints } = cssVariables

export const Image: React.FC<MediaProps> = props => {
  const {
    imgClassName,
    onClick,
    onLoad: onLoadFromProps,
    resource,
    priority,
    fill = true,
    src: srcFromProps,
    alt: altFromProps,
  } = props

  const [isLoading, setIsLoading] = React.useState(true)
  const [isZoomed, setIsZoomed] = React.useState(false)

  let width: number | undefined
  let height: number | undefined
  let alt = altFromProps
  let src: StaticImageData | string = srcFromProps || ''

  if (!src && resource && typeof resource !== 'string') {
    const {
      width: fullWidth,
      height: fullHeight,
      filename: fullFilename,
      alt: altFromResource,
    } = resource

    width = fullWidth
    height = fullHeight
    alt = altFromResource

    const filename = fullFilename

    src = `${process.env.NEXT_PUBLIC_SERVER_URL}/media/${filename}`
  }

  // NOTE: this is used by the browser to determine which image to download at different screen sizes
  const sizes = Object.entries(breakpoints)
    .map(([, value]) => `(max-width: ${value}px) ${value}px`)
    .join(', ')

  const handleImageClick = () => {
    setIsZoomed(prev => !prev)
  }

  return (
    <div
      className={[classes.imageWrapper, isZoomed && classes.zoomed].filter(Boolean).join(' ')}
      onClick={handleImageClick}
    >
      <NextImage
        className={[
          isLoading && classes.placeholder,
          classes.image,
          imgClassName,
          isZoomed && classes.zoomed,
        ]
          .filter(Boolean)
          .join(' ')}
        src={typeof resource !== 'string' && resource.url}
        alt={alt || ''}
        onClick={onClick}
        onLoad={() => {
          setIsLoading(false)
          if (typeof onLoadFromProps === 'function') {
            onLoadFromProps()
          }
        }}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        sizes={sizes}
        priority={priority}
      />
    </div>
  )
}
