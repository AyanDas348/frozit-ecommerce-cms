// components/LoadingHandler.js
'use client'

import { useEffect, useState } from 'react'

import useLoadingState from '../../_hooks/useLoadingState'
import LoadingScreen from '../Loader'
// import LoadingScreen from '../LoadingScreen'

const LoadingHandler = ({ children }) => {
  const loading = useLoadingState()
  const [fade, setFade] = useState(false)

  useEffect(() => {
    if (!loading) {
      // Start fade-out effect when loading is false
      setFade(true)
      // Delay hiding the loading screen until fade-out completes
      const timer = setTimeout(() => {
        setFade(false)
      }, 3000) // Match this with the fade duration
      return () => clearTimeout(timer)
    }
  }, [loading])

  return (
    <div className={fade ? 'fadeOut' : ''}>
      {loading ? <LoadingScreen /> : <div className={fade ? 'fadeIn' : ''}>{children}</div>}
    </div>
  )
}

export default LoadingHandler
