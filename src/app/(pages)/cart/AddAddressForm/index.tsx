import React, { useState } from 'react'
import { toast } from 'react-toastify'

import { useAuth } from '../../../_providers/Auth'

import styles from './index.module.scss'

interface Address {
  street: string
  city: string
  state: string
  pinCode: string
  country: string
  plotNo: string // Add plotNo to the interface
}

interface AddAddressFormProps {
  setAddresses: React.Dispatch<React.SetStateAction<Address[]>>
  setSelectedAddressIndex: React.Dispatch<React.SetStateAction<number>>
}

const AddAddressForm: React.FC<AddAddressFormProps> = ({
  setAddresses,
  setSelectedAddressIndex,
}) => {
  const [address, setAddress] = useState<Address>({
    street: '',
    city: '',
    state: '',
    pinCode: '',
    country: '',
    plotNo: '', // Initialize plotNo in state
  })

  const { user } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setAddress(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Convert pinCode to integer
    const dataToSend = {
      ...address,
      pinCode: parseInt(address.pinCode, 10),
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/add-address`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.jwt}`, // Ensure JWT is properly formatted
        },
        body: JSON.stringify(dataToSend),
      })

      const result = await response.json()
      if (result.success) {
        setAddresses(result.data.data.address) // Update addresses
        setSelectedAddressIndex(result.data.data.address.length - 1) // Set selected address index
        setAddress({
          street: '',
          city: '',
          state: '',
          pinCode: '',
          country: '',
          plotNo: '', // Reset plotNo along with other fields
        })
      } else {
        toast.error('Something went wrong', {
          position: 'top-center',
        })
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.', {
        position: 'top-center',
      })
    }
  }

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit}>
        <h2 className={styles.heading}>Add Address</h2>
        <label className={styles.label}>
          Street:
          <input
            type="text"
            name="street"
            value={address.street}
            onChange={handleChange}
            className={styles.inputText}
            placeholder="Enter street"
          />
        </label>
        <label className={styles.label}>
          City:
          <input
            type="text"
            name="city"
            value={address.city}
            onChange={handleChange}
            className={styles.inputText}
            placeholder="Enter city"
          />
        </label>
        <label className={styles.label}>
          State:
          <input
            type="text"
            name="state"
            value={address.state}
            onChange={handleChange}
            className={styles.inputText}
            placeholder="Enter state"
          />
        </label>
        <label className={styles.label}>
          Pin Code:
          <input
            type="text" // Use text to handle input formatting issues
            name="pinCode"
            value={address.pinCode}
            onChange={handleChange}
            className={styles.inputText}
            placeholder="Enter pin code"
          />
        </label>
        <label className={styles.label}>
          Country:
          <input
            type="text"
            name="country"
            value={address.country}
            onChange={handleChange}
            className={styles.inputText}
            placeholder="Enter country"
          />
        </label>
        <label className={styles.label}>
          Plot No:
          <input
            type="text"
            name="plotNo"
            value={address.plotNo}
            onChange={handleChange}
            className={styles.inputText}
            placeholder="Enter plot number"
          />
        </label>
        <button type="submit" className={styles.submitButton}>
          Submit
        </button>
      </form>
    </div>
  )
}

export default AddAddressForm