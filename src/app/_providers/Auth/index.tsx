'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import * as firebaseAuth from 'firebase/auth'

import { auth } from '../../../firebase'
import { User } from '../../../payload/payload-types'

// eslint-disable-next-line no-unused-vars
type ResetPassword = (args: {
  password: string
  passwordConfirm: string
  token: string
}) => Promise<void>

type ForgotPassword = (args: { email: string }) => Promise<void> // eslint-disable-line no-unused-vars

type Create = (args: {
  name: string
  phoneNumber: string
  email: string
  password: string
  passwordConfirm: string
}) => Promise<void> // eslint-disable-line no-unused-vars

type Login = (args: { email: string; password: string }) => Promise<User> // eslint-disable-line no-unused-vars

type Logout = () => Promise<void>

type LoginWithPhone = (args: { phoneNumber: string }) => Promise<firebaseAuth.ConfirmationResult>

type verifyOTP = (user: firebaseAuth.ConfirmationResult, otp: string) => Promise<void>

type AuthContext = {
  user?: User | null
  setUser: (user: User | null) => void // eslint-disable-line no-unused-vars
  logout: Logout
  login: Login
  create: Create
  resetPassword: ResetPassword
  forgotPassword: ForgotPassword
  status: undefined | 'loggedOut' | 'loggedIn'
  loginWithPhone: LoginWithPhone
  verifyOTP: verifyOTP
  mobileUser?: firebaseAuth.User | null
  setMobileUser: (mobileUser: firebaseAuth.User | null) => void
}

const Context = createContext({} as AuthContext)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>()
  const [mobileUser, setMobileUser] = useState<firebaseAuth.User | null>()

  // used to track the single event of logging in or logging out
  // useful for `useEffect` hooks that should only run once
  const [status, setStatus] = useState<undefined | 'loggedOut' | 'loggedIn'>()

  const saveUserToLocalStorage = (user: User | null) => {
    if (user) {
      localStorage.setItem('frozit-user', JSON.stringify(user))
    } else {
      localStorage.removeItem('frozit-user')
    }
  }

  const loadUserFromLocalStorage = () => {
    const userData = localStorage.getItem('frozit-user')
    if (userData) {
      setUser(JSON.parse(userData))
      setStatus('loggedIn')
    }
  }

  useEffect(() => {
    loadUserFromLocalStorage()
  }, [])

  const create = useCallback<Create>(async args => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: args.name,
          email: args.email,
          phoneNumber: args.phoneNumber,
          password: args.password,
        }),
      })

      const response = await res.json()

      if (response.success) {
        const { success, data } = response
        setUser(data)
        setStatus('loggedIn')
        saveUserToLocalStorage(data)
      } else {
        throw new Error('Invalid login')
      }
    } catch (e) {
      throw new Error('An error occurred while attempting to login.')
    }
  }, [])

  const login = useCallback<Login>(async args => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/login`, {
        method: 'POST',
        // credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: args.email,
          password: args.password,
        }),
      })

      if (res.ok) {
        const response = await res.json()
        const { data, success, errors } = response
        if (errors) throw new Error(errors[0].message)
        setUser(data)
        setStatus('loggedIn')
        saveUserToLocalStorage(data)
        return data
      }

      throw new Error('Invalid login')
    } catch (e) {
      throw new Error('An error occurred while attempting to login.')
    }
  }, [])

  const logout = useCallback<Logout>(async () => {
    try {
      setUser(null)
      setStatus('loggedOut')
      toast.success('Logged out successfully', { position: 'top-center' })
      saveUserToLocalStorage(null)
      window.location.href = '/products'
    } catch (e) {
      throw new Error('An error occurred while attempting to logout.')
    }
  }, [])

  const forgotPassword = useCallback<ForgotPassword>(async args => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/forgot-password`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: args.email,
        }),
      })

      if (res.ok) {
        const { data, errors } = await res.json()
        if (errors) throw new Error(errors[0].message)
        setUser(data?.loginUser?.user)
      } else {
        throw new Error('Invalid login')
      }
    } catch (e) {
      throw new Error('An error occurred while attempting to login.')
    }
  }, [])

  const resetPassword = useCallback<ResetPassword>(async args => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/reset-password`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: args.password,
          passwordConfirm: args.passwordConfirm,
          token: args.token,
        }),
      })

      if (res.ok) {
        const { data, errors } = await res.json()
        if (errors) throw new Error(errors[0].message)
        setUser(data?.loginUser?.user)
        setStatus(data?.loginUser?.user ? 'loggedIn' : undefined)
        saveUserToLocalStorage(data?.loginUser?.user)
      } else {
        throw new Error('Invalid login')
      }
    } catch (e) {
      throw new Error('An error occurred while attempting to login.')
    }
  }, [])

  const loginWithPhone = useCallback<LoginWithPhone>(async args => {
    const recaptchaContainerId = 'recaptcha'
    const recaptchaContainer = document.getElementById(recaptchaContainerId)

    if (!recaptchaContainer) {
      console.error(`Recaptcha container with id '${recaptchaContainerId}' not found.`)
      return
    }

    const recaptcha = new firebaseAuth.RecaptchaVerifier(auth, recaptchaContainer, {
      size: 'invisible',
    })

    try {
      // Sign in with phone number and get confirmation result
      const confirmationResult = await firebaseAuth.signInWithPhoneNumber(
        auth,
        args.phoneNumber,
        recaptcha,
      )

      return confirmationResult
    } catch (error) {
      console.error('Error during phone authentication:', error)
      throw error
    }
  }, [])

  const verifyOTP = async (user: firebaseAuth.ConfirmationResult, otp: string) => {
    try {
      const credential = firebaseAuth.PhoneAuthProvider.credential(user.verificationId, otp)
      const verifiedUser = await firebaseAuth.signInWithCredential(auth, credential)
      const idToken = await verifiedUser.user.getIdToken()
      const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/get-user`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      })
      const backendUser = await req.json()
      setUser(backendUser.data)
    } catch (err: any) {
      console.error(err)
    }
  }

  return (
    <Context.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        create,
        resetPassword,
        forgotPassword,
        status,
        loginWithPhone,
        verifyOTP,
        mobileUser,
        setMobileUser,
      }}
    >
      {children}
    </Context.Provider>
  )
}

type UseAuth<T = User> = () => AuthContext // eslint-disable-line no-unused-vars

export const useAuth: UseAuth = () => useContext(Context)
