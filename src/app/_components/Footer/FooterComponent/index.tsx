'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Footer, Media } from '../../../../payload/payload-types'
import { inclusions, noHeaderFooterUrls, profileNavItems } from '../../../constants'
import { Button } from '../../Button'
import { Gutter } from '../../Gutter'

import classes from './index.module.scss'

const FooterComponent = ({ footer }: { footer: Footer }) => {
  const pathname = usePathname()
  return (
    <footer className={noHeaderFooterUrls.includes(pathname) ? classes.hide : ''}>
      <Gutter className={classes.gutter}>
        {/* <ul className={classes.inclusions}>
          {inclusions.map((inclusion, index) => (
            <li key={inclusion.title}>
              <Image
                src={inclusion.icon}
                alt={inclusion.title}
                width={36}
                height={36}
                className={classes.icon}
              />
              <h5 className={classes.title}>{inclusion.title}</h5>
              <p>{inclusion.description}</p>
            </li>
          ))}
        </ul> */}
        <p>
          Providing you Ready to Eat Frozen Foods, Fresh & Packed Delectable Bakery products,
          Refreshing Drinks and much more. You can enjoy all the products served as ready to eat at
          our outlet or get the packaged frozen ones for later use.
        </p>
      </Gutter>
      <div className={classes.footer}>
        <Gutter>
          <div className={classes.wrap}>
            <Link href="/">
              <Image src="/assets/logo/logo.png" alt="logo" width={170} height={50} color="white" />
            </Link>
            <p>{footer.copyright}</p>
            <div className={classes.socialLinks}>
              {footer?.navItems.map(item => {
                const icon = item?.link?.icon as Media
                return (
                  <Button
                    key={item.link.label}
                    el="link"
                    href={item.link.url}
                    newTab={true}
                    className={classes.socialLinks}
                  >
                    <Image
                      src={icon?.url}
                      alt={item.link.label}
                      width={24}
                      height={24}
                      className={classes.socialIcon}
                    />
                  </Button>
                )
              })}
            </div>
          </div>
        </Gutter>
      </div>
    </footer>
  )
}

export default FooterComponent
