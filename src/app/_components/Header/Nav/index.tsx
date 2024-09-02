'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronDown, ChevronRight, ChevronUp, Search, UserCircle2 } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

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
  const shopRef = useRef<HTMLDivElement>(null)
  const searchBarRef = useRef<HTMLDivElement>(null)
  const [isSearchResultOpen, setIsSearchResultOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false)
  const pathname = usePathname()
  const [categories, setCategories] = useState([])

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
    setIsShopDropdownOpen(false)
  }

  const shopDropdown = () => {
    setIsShopDropdownOpen(!isShopDropdownOpen)
    setIsDropdownOpen(false)
  }

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false)
    }
    if (shopRef.current && !shopRef.current.contains(event.target as Node)) {
      setIsShopDropdownOpen(false)
    }
    if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
      setIsSearchResultOpen(false)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [handleClickOutside])

  useEffect(() => {
    const searchItem = async () => {
      const request = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/itemsInventory/search-item?item_name=${searchText}`,
      )
      const response = await request.json()
      return response
    }
    if (searchText.length > 0) {
      searchItem().then(res => {
        if (res.success) {
          setIsSearchResultOpen(true)
          setSearchResults(res.data.data)
        }
      })
    }
  }, [searchText])

  useEffect(() => {
    setSearchText('')
    setIsSearchResultOpen(false)
    setSearchResults([])
  }, [pathname])

  useEffect(() => {
    ;(async () => {
      const fetchCategories = async () => {
        try {
          const request = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/itemsInventory/category`,
          )
          const response = await request.json()
          if (response.success) {
            const data = response.data.data.map(category => ({
              id: category.category_id,
              title: category.category_name,
            }))
            setCategories(data)
          }
        } catch (e) {
          console.log(e)
        }
      }
      fetchCategories()
    })()
  }, [])

  return (
    <nav className={[classes.nav].filter(Boolean).join(' ')}>
      <div className={classes.searchBar} ref={searchBarRef}>
        <Search />
        <input
          type="search"
          placeholder="Search here"
          className={classes.searchInput}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
        />
        {isSearchResultOpen && (
          <ul className={classes.accountLinks}>
            {searchResults.map(item => (
              <li key={item.item_id} className={classes.accountLinkItem}>
                <Link href={`/products/${item.item_id}`}>{item.name}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className={classes.shopSection} ref={shopRef}>
        Shop
        {isShopDropdownOpen ? (
          <ChevronUp
            style={{ color: 'white', cursor: 'pointer' }}
            onClick={shopDropdown}
            className={classes.arrow}
          />
        ) : (
          <ChevronDown style={{ color: 'white', cursor: 'pointer' }} onClick={shopDropdown} />
        )}
        {isShopDropdownOpen && (
          <ul className={classes.accountLinks}>
            {categories?.map(item => (
              <li className={classes.accountLinkItem} key={item.id}>
                <Link href={`/products?category_id=${item.id}`}>{item.title}</Link>
                <ChevronRight />
              </li>
            ))}
          </ul>
        )}
      </div>
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
            <li className={classes.accountLinkItem}>
              <Link href={'/wishlist'}>Wishlist</Link>
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
