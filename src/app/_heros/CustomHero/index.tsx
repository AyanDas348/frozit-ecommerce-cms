import React, { Fragment, useEffect, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'

import { Page } from '../../../payload/payload-types'
import { Button } from '../../_components/Button'
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
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [bgImages.length])

  return (
    <section className={classes.hero}>
      <div className={classes.heroWrapper} style={{ backgroundImage: `url(${bgImages[index]})` }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            background: 'linear-gradient(to right, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0))',
          }}
        ></div>
        <div className={classes.overlay}>
          <div className={classes.heroTextBox}>
            {richText.length !== 0 && <RichText content={richText} />}
            <h2 className={classes.ctaText}>Explore all our products</h2>
            <div style={{ width: '50%', zIndex: '1' }}>
              <Button appearance="primary" href="/products">
                Shop Now
                <ArrowUpRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
