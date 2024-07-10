import React from 'react'

import styles from './index.module.scss'

interface ModalProps {
  onClose: () => void
  onAddAddress?: () => void // Optional handler for the + button
  children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ onClose, onAddAddress, children }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {onAddAddress && (
          <button className={styles.addButton} onClick={onAddAddress}>
            +
          </button>
        )}
        <button className={styles.closeButton} onClick={onClose}>
          x
        </button>
        {children}
      </div>
    </div>
  )
}

export default Modal
