export const inclusions = [
  {
    title: 'Online Support',
    description: '24 hours a day, 7 days a week',
    icon: '/assets/icons/support.svg',
  },
  {
    title: 'Flexible Payment',
    description: 'Pay with multiple credit cards',
    icon: '/assets/icons/payment.svg',
  },
]

export const profileNavItems = [
  {
    title: 'Personal Information',
    url: '/account',
    icon: '/assets/icons/user.svg',
  },
  {
    title: 'My Purchases',
    url: '/account/purchases',
    icon: '/assets/icons/purchases.svg',
  },
  {
    title: 'My Orders',
    url: '/account/orders',
    icon: '/assets/icons/orders.svg',
  },
  {
    title: 'Logout',
    url: '/logout',
    icon: '/assets/icons/logout.svg',
  },
]

export const noHeaderFooterUrls = ['/create-account', '/login', '/recover-password']

export const defaultCategories = [
  {
    id: '1',
    title: 'Daily Goods',
    media: null,
    updatedAt: Date.now().toString(),
    createdAt: Date.now().toString(),
  },
  {
    id: '2',
    title: 'Bakery',
    media: null,
    updatedAt: Date.now().toString(),
    createdAt: Date.now().toString(),
  },
  {
    id: '3',
    title: 'Frozen Foods',
    media: null,
    updatedAt: Date.now().toString(),
    createdAt: Date.now().toString(),
  },
]
