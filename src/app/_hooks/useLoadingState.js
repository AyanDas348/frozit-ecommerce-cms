// hooks/useLoadingState.js
'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

const useLoadingState = () => {
  const [loading, setLoading] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setLoading(true)

    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000) // Adjust the duration as needed

    return () => clearTimeout(timer)
  }, [pathname])

  return loading
}

export default useLoadingState
