import React from 'react'
import Link from 'next/link'

import { Footer } from '../../../payload/payload-types'
import { fetchFooter } from '../../_api/fetchGlobals'
import FooterComponent from './FooterComponent'

import classes from './index.module.scss'

export async function Footer1() {
  let footer: Footer | null = {
    id: '1',
    copyright: '@2024 Frozit. All Rights Reserved.',
    navItems: [],
  }

  const navItems = footer?.navItems || []

  return (
    <>
      <FooterComponent footer={footer} />
    </>
  )
}
