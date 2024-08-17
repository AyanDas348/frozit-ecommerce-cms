'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react'

import { CartItems, Product, User } from '../../../payload/payload-types'
import { useAuth } from '../Auth'
import { CartItem, cartReducer } from './reducer'

export type CartContext = {
  cart: User['cart']
  addItemToCart: (item: CartItem) => void
  deleteItemFromCart: (product: Product) => void
  cartIsEmpty: boolean | undefined
  clearCart: () => void
  isProductInCart: (product: Product) => boolean
  cartTotal: {
    formatted: string
    raw: number
  }
  hasInitializedCart: boolean
  setHasInitializedCart: (item: boolean) => void
}

interface CartResponse {
  success: boolean
  data: {
    msg: string
    data: {
      itemDetails: ItemDetail[]
    }
  }
}
interface ItemDetail {
  item_id: string
  quantity: number
  price: number
  imageUrl: string | 'abcd'
}

const Context = createContext({} as CartContext)

export const useCart = () => useContext(Context)

const arrayHasItems = array => Array.isArray(array) && array.length > 0

export const CartProvider = props => {
  const { children } = props
  const { user, status: authStatus, firebaseUser } = useAuth()

  const [cart, dispatchCart] = useReducer(cartReducer, { items: [] })
  const [total, setTotal] = useState<{ formatted: string; raw: number }>({
    formatted: '0.00',
    raw: 0,
  })
  const hasInitialized = useRef(false)
  const [hasInitializedCart, setHasInitializedCart] = useState(true)

  const addItemToCart = useCallback(incomingItem => {
    dispatchCart({ type: 'ADD_ITEM', payload: incomingItem })
  }, [])

  const deleteItemFromCart = useCallback(
    (incomingProduct: Product) => {
      dispatchCart({ type: 'DELETE_ITEM', payload: incomingProduct })
      const deleteItemFromCart = async () => {
        const token = await firebaseUser.getIdToken()
        const request = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/cart/remove-from-cart?item_id=${incomingProduct.id}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
      }
      deleteItemFromCart()
    },
    [firebaseUser],
  )

  const clearCart = useCallback(() => {
    dispatchCart({ type: 'CLEAR_CART' })
  }, [])

  const fetchProductDetails = async (id: string): Promise<Product | null> => {
    try {
      const req = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/itemsInventory/get-item-details?item_id=${id}`,
      )
      const data = await req.json()
      const itemDetails = data?.data?.data?.item

      return {
        createdAt: itemDetails.created_time,
        id: id,
        stock: itemDetails.warehouses.find(
          warehouse => warehouse.warehouse_id === '1697951000000042277',
        ).warehouse_stock_on_hand,
        title: itemDetails.item_name,
        updatedAt: itemDetails.last_modified_time,
        meta: {
          description: itemDetails.description,
          image: {
            alt: itemDetails.image_name || '',
            id: id || '',
            url: itemDetails.image_document_id || '',
            createdAt: Date.now().toString(),
            updatedAt: Date.now().toString(),
          },
          title: itemDetails.name,
        },
        layout: [],
      }
    } catch (error) {
      console.error('Error fetching product details:', error)
      return null
    }
  }

  useEffect(() => {
    const syncCartFromLocalStorage = async () => {
      const localCart = localStorage.getItem('cart')
      const parsedCart = JSON.parse(localCart || '{}')
      console.log(localCart, parsedCart)

      if (parsedCart?.items && parsedCart?.items?.length > 0) {
        const items: CartItem[] = await Promise.all(
          parsedCart.items.map(async item => {
            const product = await fetchProductDetails(item.id)
            if (product) {
              return {
                product,
                quantity: item.quantity,
                id: item.id,
                imageUrl: typeof product.meta.image !== 'string' ? product.meta.image.url : '',
                price: item.price,
              }
            }
            return null
          }),
        ).then(items => items.filter(Boolean) as CartItem[])

        dispatchCart({ type: 'SET_CART', payload: { items } })
      } else {
        console.log('i ran')
        dispatchCart({ type: 'SET_CART', payload: { items: [] } })
      }
    }
    if (!hasInitialized.current) {
      console.log('i ran 3')
      hasInitialized.current = true
      syncCartFromLocalStorage()
    }
  }, [])

  const transformIncomingCartResponse = (itemDetails: any[]): CartItems => {
    return itemDetails.map(item => ({
      product: {
        createdAt: item.created_time,
        id: item.item_id,
        layout: [],
        stock: item.stock_on_hand,
        title: item.name,
        updatedAt: item.last_modified_time,
        priceJSON: item.price,
        meta: {
          description: item.description,
          image: {
            alt: item.name,
            id: item.item_id,
            url: item.imageUrl,
            createdAt: item.created_time,
            updatedAt: item.last_modified_time,
            filename: item.image_name,
          },
          title: item.image_name,
        },
        slug: item.item_id,
        publishedOn: item.created_time,
        _status: 'published',
      },
      price: item.rate * item.quantity,
      id: item.item_id,
      imageUrl: item.image_document_id,
      quantity: item.quantity,
    }))
  }

  useEffect(() => {
    if (!hasInitialized.current || !user || !firebaseUser) return
    hasInitialized.current = true
    const getCart = async (): Promise<CartResponse> => {
      const token = await firebaseUser.getIdToken()
      const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/cart/get-cart`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await req.json()
      return data
    }

    if (authStatus === 'loggedIn') {
      getCart().then(cart => {
        if (cart.success) {
          const transformedData = transformIncomingCartResponse(cart.data.data.itemDetails)
          dispatchCart({ type: 'MERGE_CART', payload: { items: transformedData } })
        }
      })
    }

    if (authStatus === 'loggedOut') {
      console.log('i ran')
      dispatchCart({ type: 'CLEAR_CART' })
    }
  }, [user, authStatus, firebaseUser])

  const flattenedCart = {
    ...cart,
    items: cart?.items
      ?.map(item => {
        if (!item?.product || typeof item?.product !== 'object') {
          return null
        }

        return {
          ...item,
          product: item?.product?.id,
          quantity: typeof item?.quantity === 'number' ? item?.quantity : 0,
        }
      })
      .filter(Boolean) as CartItem[],
  }

  const isProductInCart = useCallback(
    (incomingProduct: Product): boolean => {
      const { items: itemsInCart } = cart || {}
      return (
        Array.isArray(itemsInCart) &&
        itemsInCart.some(
          ({ product }) =>
            typeof product === 'string'
              ? product === incomingProduct.id
              : product?.id === incomingProduct.id,
          // eslint-disable-next-line function-paren-newline
        )
      )
    },
    [cart],
  )

  useEffect(() => {
    if (!hasInitialized.current || !user) return
    if (authStatus === 'loggedIn') {
      const getCart = async (): Promise<CartResponse> => {
        const token = await firebaseUser.getIdToken()
        const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/cart/get-cart`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await req.json()
        return data
      }
      const addToCart = async (item: ItemDetail) => {
        const body = [item]
        const token = await firebaseUser.getIdToken()
        const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/cart/add-to-cart`, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        return await req.json()
      }

      const updateCart = async (item_id: string, quantity: number) => {
        const token = await firebaseUser.getIdToken()
        await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/cart/update-cart`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ item_id, quantity }),
        })
      }

      getCart().then(response => {
        const dbCart = response.data.data.itemDetails
        if (response.success && cart.items.length > 0) {
          cart.items.forEach(item => {
            const dbItem = dbCart.find(dbItem => dbItem.item_id === item.id)
            if (dbItem) {
              if (item.quantity !== dbItem.quantity) {
                updateCart(dbItem.item_id, item.quantity - dbItem.quantity)
              }
            } else {
              addToCart({
                item_id: item.id,
                quantity: item.quantity,
                price: item.price,
                imageUrl: item.imageUrl || 'abcd',
              })
            }
          })
        } else if (!response.success && cart.items.length > 0) {
          cart.items.forEach(item => {
            addToCart({
              item_id: item.id,
              quantity: item.quantity,
              price: item.price,
              imageUrl: item.imageUrl || 'abcd',
            })
          })
        }
      })
    } else {
      localStorage.setItem('cart', JSON.stringify(flattenedCart))
    }

    setHasInitializedCart(true)
  }, [user, authStatus, cart]) // eslint-disable-line

  useEffect(() => {
    if (!hasInitialized.current) return

    const newTotal =
      cart?.items?.reduce((acc, item) => {
        return (
          acc + (typeof item.product === 'object' ? item?.product?.priceJSON * item?.quantity : 0)
        )
      }, 0) || 0

    setTotal({
      formatted: newTotal.toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR',
      }),
      raw: newTotal,
    })
  }, [cart, hasInitialized])

  useEffect(() => {
    if (hasInitializedCart) {
      hasInitialized.current = true
    }
  }, [hasInitializedCart])
  return (
    <Context.Provider
      value={{
        cart,
        addItemToCart,
        deleteItemFromCart,
        cartIsEmpty: hasInitializedCart && !arrayHasItems(cart?.items),
        clearCart,
        isProductInCart,
        cartTotal: total,
        hasInitializedCart,
        setHasInitializedCart,
      }}
    >
      {children}
    </Context.Provider>
  )
}
