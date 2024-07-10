import React from 'react'

import Modal from '../Modal'

import styles from './index.module.scss'

interface Address {
  street: string
  city: string
  state: string
  pinCode: string
  country: string
  plotNo: string
}

interface SelectAddressModalProps {
  addresses: Address[]
  selectedAddressIndex: number
  setSelectedAddressIndex: (index: number) => void
  onOpenAddAddressModal: () => void
  onClose: () => void
}

const SelectAddressModal: React.FC<SelectAddressModalProps> = ({
  addresses,
  selectedAddressIndex,
  setSelectedAddressIndex,
  onOpenAddAddressModal,
  onClose,
}) => {
  return (
    <Modal onClose={onClose} onAddAddress={onOpenAddAddressModal}>
      <h4>Select Address</h4>
      <div className={styles.addressList}>
        {addresses.map((address, index) => (
          <div
            key={index}
            className={`${styles.address} ${selectedAddressIndex === index ? styles.selected : ''}`}
            onClick={() => {
              setSelectedAddressIndex(index)
              onClose()
            }}
          >
            {`${address.street}, ${address.city}, ${address.state}, ${address.pinCode}, ${address.country}`}
          </div>
        ))}
      </div>
    </Modal>
  )
}

export default SelectAddressModal
