interface Address {
  street: string
  city: string
  state: string
  pinCode: number
  country: string
}

interface AddressCardProps {
  address: Address
  index: number
  isSelected: boolean
  onSelect: (index: number) => void
}

import classes from './index.module.scss'

const AddressCard: React.FC<AddressCardProps> = ({ address, index, isSelected, onSelect }) => {
  return (
    <div className={classes.addressCard}>
      <input type="radio" checked={isSelected} onChange={() => onSelect(index)} />
      <div>
        <p>{address.street},</p>
        <p>{address.city},</p>
        <p>{address.pinCode},</p>
      </div>
      <div>
        <p>{address.state}</p>
        <p>{address.country}</p>
      </div>
    </div>
  )
}

export default AddressCard
