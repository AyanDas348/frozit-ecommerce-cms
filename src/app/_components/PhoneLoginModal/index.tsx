import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Modal from 'react-modal'
import * as firebaseAuth from 'firebase/auth'
import { useRouter } from 'next/navigation'

import { useAuth } from '../../_providers/Auth'
import { Button } from '../Button'
import { Input } from '../Input'

import classes from './index.module.scss'

// Modal.setAppElement('#__next') // This is important for accessibility

type PhoneFormData = {
  phoneNumber: number
  otp: number
}

interface PhoneLoginModalProps {
  isOpen: boolean
  onRequestClose: () => void
}

const PhoneLoginModal: React.FC<PhoneLoginModalProps> = ({ isOpen, onRequestClose }) => {
  const { loginWithPhone, verifyOTP, authLoading } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PhoneFormData>()
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [verificationId, setVerificationId] = useState<firebaseAuth.ConfirmationResult>(null)
  const [error, setError] = useState<string | null>(null)

  const handlePhoneSubmit = async (data: { phoneNumber: string }) => {
    try {
      const verificationId = await loginWithPhone({ phoneNumber: '+91' + data.phoneNumber })
      setVerificationId(verificationId)
      setStep('otp')
    } catch (error) {
      setError('Failed to send OTP. Please try again.')
    }
  }

  const router = useRouter()

  const handleOtpSubmit = async (data: { otp: string }) => {
    try {
      await verifyOTP(verificationId, data.otp)
      onRequestClose()
      if (typeof window !== 'undefined' && window.location.pathname === '/login') {
        router.push('/')
      }
    } catch (error) {
      setError('Invalid OTP. Please try again.')
    }
  }

  if (!isOpen) return null

  return (
    <div className={classes.modalOverlay}>
      <div className={classes.modalContent}>
        <button className={classes.closeButton} onClick={onRequestClose}>
          &times;
        </button>
        <form
          onSubmit={
            step === 'phone' ? handleSubmit(handlePhoneSubmit) : handleSubmit(handleOtpSubmit)
          }
        >
          {error && <p className={classes.error}>{error}</p>}
          {step === 'phone' && (
            <div>
              <div className={classes.field}>
                <Input
                  name="phoneNumber"
                  label="Phone Number"
                  required
                  register={register}
                  error={errors.phoneNumber}
                  type="number"
                />
                <Button
                  type="submit"
                  appearance="primary"
                  label={authLoading ? 'Sending OTP ...' : 'Send OTP'}
                />
              </div>
              {!verificationId && <div id="recaptcha" style={{ display: 'none' }}></div>}
            </div>
          )}
          {step === 'otp' && (
            <>
              <div className={classes.field}>
                <Input
                  name="otp"
                  label="OTP"
                  required
                  register={register}
                  error={errors.otp}
                  type="text"
                />
                <Button
                  type="submit"
                  appearance="primary"
                  label={authLoading ? 'Verifying OTP ...' : 'Verify Now'}
                />
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  )
}

export default PhoneLoginModal
