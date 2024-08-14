'use client'

import React, { useEffect, useRef, useState } from 'react'
import { ChevronDown, ChevronRight, ChevronUp, UserCircle2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Header as HeaderType } from '../../../../payload/payload-types'
import { useAuth } from '../../../_providers/Auth'
import { Button } from '../../Button'
import { CartLink } from '../../CartLink'
import { CMSLink } from '../../Link'

import classes from './index.module.scss'

export const HeaderNav: React.FC<{ header: HeaderType }> = ({ header }) => {
  const navItems = header?.navItems || []
  const { user, logout } = useAuth()
  const router = useRouter()

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownRef])

  return (
    <nav className={[classes.nav].filter(Boolean).join(' ')}>
      <Link href={'/products'} style={{ color: 'white', cursor: 'pointer' }}>
        Shop
      </Link>
      <CartLink />
      <div className={classes.userSection} ref={dropdownRef}>
        <UserCircle2
          onClick={() => router.push('/orders')}
          style={{ color: 'white', cursor: 'pointer' }}
        />
        {isDropdownOpen ? (
          <ChevronUp
            style={{ color: 'white', cursor: 'pointer' }}
            onClick={toggleDropdown}
            className={classes.arrow}
          />
        ) : (
          <ChevronDown style={{ color: 'white', cursor: 'pointer' }} onClick={toggleDropdown} />
        )}
        {isDropdownOpen && (
          <ul className={classes.accountLinks}>
            <li className={classes.accountLinkItem}>
              <Link href={'/products'}>Shop</Link>
              <ChevronRight />
            </li>
            <li className={classes.accountLinkItem}>
              <Link href={'/orders'}>Orders</Link>
              <ChevronRight />
            </li>
            <li className={classes.accountLinkItem}>
              <Link href={'/cart'}>Cart</Link>
              <ChevronRight />
            </li>
            <li
              className={classes.accountLinkItem}
              onClick={() => {
                user ? logout() : router.push('/login')
              }}
            >
              {user ? 'Logout' : 'Login'}
              <ChevronRight />
            </li>
          </ul>
        )}
      </div>
    </nav>
  )
}
