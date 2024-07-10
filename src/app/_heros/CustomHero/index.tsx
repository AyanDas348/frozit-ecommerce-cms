'use client'

import React, { Fragment, useEffect, useState } from 'react'

import { Page } from '../../../payload/payload-types'
import { Gutter } from '../../_components/Gutter'
import { CMSLink } from '../../_components/Link'
import { Media } from '../../_components/Media'
import RichText from '../../_components/RichText'

import classes from './index.module.scss'

export const CustomHero: React.FC<Page['hero']> = ({ richText, media, links, bgImages }) => {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (bgImages.length > 1) {
      const interval = setInterval(() => {
        setIndex(prevIndex => (prevIndex + 1) % bgImages.length)
      }, 7000) // Change image every 5 seconds
      return () => clearInterval(interval)
    }
  }, [bgImages.length])

  return (
    <section className={classes.hero}>
      <div className={classes.heroWrapper} style={{ backgroundImage: `url(${bgImages[index]})` }}>
        <div className={classes.heroTextBox}>
          <RichText content={richText} />

          {Array.isArray(links) && links.length > 0 && (
            <ul className={classes.links}>
              {links.map(({ link }, i) => (
                <li key={i}>
                  <CMSLink {...link} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
