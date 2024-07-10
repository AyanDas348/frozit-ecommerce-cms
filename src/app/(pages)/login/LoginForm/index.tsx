'use client'

import React, { useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import { Button } from '../../../_components/Button'
import { Message } from '../../../_components/Message'
import PhoneLoginModal from '../../../_components/PhoneLoginModal'
import { useAuth } from '../../../_providers/Auth'

import classes from './index.module.scss'

const LoginForm: React.FC = () => {
  const searchParams = useSearchParams()
  const allParams = searchParams.toString() ? `?${searchParams.toString()}` : ''
  const redirect = useRef(searchParams.get('redirect'))
  const { googleSignIn } = useAuth()
  const router = useRouter()
  const [error, setError] = React.useState<string | null>(null)
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false)

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn()
      if (redirect?.current) router.push(redirect.current as string)
      else router.push('/')
    } catch (_) {
      setError('There was an error with Google sign-in. Please try again.')
    }
  }

  return (
    <>
      <div className={classes.loginContainer}>
        <Message error={error} className={classes.message} />
        <Button
          type="button"
          appearance="primary"
          label="Sign in with Google"
          onClick={handleGoogleSignIn}
          className={classes.googleButton}
        />
        <Button
          type="button"
          appearance="secondary"
          label="Sign in with OTP"
          onClick={() => setIsPhoneModalOpen(true)}
          className={classes.otpButton}
        />
      </div>
      <PhoneLoginModal
        isOpen={isPhoneModalOpen}
        onRequestClose={() => setIsPhoneModalOpen(false)}
      />
    </>
  )
}

export default LoginForm
