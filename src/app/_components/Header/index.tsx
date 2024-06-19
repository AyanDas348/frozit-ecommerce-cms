{
  /* eslint-disable @next/next/no-img-element */
}

import React from 'react'
import Link from 'next/link'

import { Header } from '../../../payload/payload-types'
import HeaderComponent from './HeaderComponent'

export async function Header1() {
  let header: Header | null = {
    navItems: [
      {
        link: {
          label: 'Shop',
          icon: null,
          newTab: null,
          reference: {
            relationTo: 'pages',
            value: 'products',
          },
          type: 'reference',
          url: '/products',
        },
      },
    ],
    id: 'shop',
  }

  return (
    <>
      <HeaderComponent header={header} />
    </>
  )
}
