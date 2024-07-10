import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Modal from 'react-modal'
import * as firebaseAuth from 'firebase/auth'

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
  const { loginWithPhone, verifyOTP } = useAuth()
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

  const handleOtpSubmit = async (data: { otp: string }) => {
    try {
      await verifyOTP(verificationId, data.otp)
      onRequestClose()
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
            <>
              <div>
                <Input
                  name="phoneNumber"
                  label="Phone Number"
                  required
                  register={register}
                  error={errors.phoneNumber}
                  type="number"
                />
                <Button type="submit" appearance="primary" label="Get OTP" />
              </div>
              {!verificationId && <div id="recaptcha"></div>}
            </>
          )}
          {step === 'otp' && (
            <>
              <div>
                <Input
                  name="otp"
                  label="OTP"
                  required
                  register={register}
                  error={errors.otp}
                  type="text"
                />
                <Button type="submit" appearance="primary" label="Verify Now" />
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  )
}

export default PhoneLoginModal
