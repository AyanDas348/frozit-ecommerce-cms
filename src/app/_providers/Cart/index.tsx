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
}

interface CartResponse {
  success: boolean
  data: {
    msg: string
    data: {
      itemDetails: {
        item_id: string
        quantity: number
      }[]
    }
  }
}

const Context = createContext({} as CartContext)

export const useCart = () => useContext(Context)

const arrayHasItems = array => Array.isArray(array) && array.length > 0

// Step 1: Check local storage for a cart
// Step 2: If there is a cart, fetch the products and hydrate the cart
// Step 3: Authenticate the user
// Step 4: If the user is authenticated, merge the user's cart with the local cart
// Step 4B: Sync the cart to Payload and clear local storage
// Step 5: If the user is logged out, sync the cart to local storage only

export const CartProvider = props => {
  // const { setTimedNotification } = useNotifications();
  const { children } = props
  const { user, status: authStatus } = useAuth()

  const [cart, dispatchCart] = useReducer(cartReducer, {
    items: [],
  })

  const [total, setTotal] = useState<{
    formatted: string
    raw: number
  }>({
    formatted: '0.00',
    raw: 0,
  })

  const hasInitialized = useRef(false)
  const [hasInitializedCart, setHasInitialized] = useState(false)

  // this method can be used to add new items AND update existing ones
  const addItemToCart = useCallback(incomingItem => {
    dispatchCart({
      type: 'ADD_ITEM',
      payload: incomingItem,
    })
  }, [])

  const deleteItemFromCart = useCallback((incomingProduct: Product) => {
    dispatchCart({
      type: 'DELETE_ITEM',
      payload: incomingProduct,
    })
  }, [])

  const clearCart = useCallback(() => {
    dispatchCart({
      type: 'CLEAR_CART',
    })
  }, [])

  // Check local storage for a cart
  // If there is a cart, fetch the products and hydrate the cart
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true

      const syncCartFromLocalStorage = async () => {
        const localCart = localStorage.getItem('cart')

        const parsedCart = JSON.parse(localCart || '{}')

        if (parsedCart?.items && parsedCart?.items?.length > 0) {
          //getItem details
          const fetchProductDetails = async (id: string): Promise<Product> => {
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
          }
          const items: CartItem[] = await Promise.all(
            parsedCart?.items?.map(async item => {
              const product = await fetchProductDetails(item.id)
              return {
                product,
                quantity: item.quantity,
                id: item.id,
                imageUrl: typeof product.meta.image !== 'string' ? product.meta.image.url : '',
                price: item.price,
              }
            }),
          )
          dispatchCart({
            type: 'SET_CART',
            payload: {
              items,
            },
          })
        } else {
          dispatchCart({
            type: 'SET_CART',
            payload: {
              items: [],
            },
          })
        }
      }

      syncCartFromLocalStorage()
    }
  }, [])

  // authenticate the user and if logged in, merge the user's cart with local state
  // only do this after we have initialized the cart to ensure we don't lose any items
  useEffect(() => {
    if (!hasInitialized.current && !user) return

    const transformIncomingCartResponse = (itemDetails: any[]): CartItems => {
      return itemDetails.map(item => {
        return {
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
                url: item.image_document_id,
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
        }
      })
    }

    const getCart = async () => {
      const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/cart/get-cart`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: user.jwt,
        },
      })
      const data = await req.json()
      return data.data
    }

    if (authStatus === 'loggedIn') {
      // merge the user's cart with the local state upon logging in
      getCart().then(cart => {
        const transformedData = transformIncomingCartResponse(cart.data.itemDetails)
        dispatchCart({
          type: 'MERGE_CART',
          payload: { items: transformedData },
        })
      })
    }

    if (authStatus === 'loggedOut') {
      // clear the cart from local state after logging out
      dispatchCart({
        type: 'CLEAR_CART',
      })
    }
  }, [user, authStatus])

  // every time we reload we fetch the cart and check the local cart and if item and quantity doesnt match then we update or add to cart
  useEffect(() => {
    // wait until we have attempted authentication (the user is either an object or `null`)
    if (!hasInitialized.current) return

    // ensure that cart items are fully populated, filter out any items that are not
    // this will prevent discontinued products from appearing in the cart
    const flattenedCart = {
      ...cart,
      items: cart?.items
        ?.map(item => {
          if (!item?.product || typeof item?.product !== 'object') {
            return null
          }

          return {
            ...item,
            // flatten relationship to product
            product: item?.product?.id,
            quantity: typeof item?.quantity === 'number' ? item?.quantity : 0,
          }
        })
        .filter(Boolean) as CartItem[],
    }

    if (authStatus === 'loggedIn') {
      try {
        const addToCart = async (items: CartItem[]) => {
          const body = items.map(item => ({
            item_id: typeof item.product !== 'string' ? parseInt(item.product.id) : item.product,
            quantity: item.quantity,
            imageUrl: item.imageUrl || 'abcd',
            price: item.price,
          }))
          const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/cart/add-to-cart`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
              'Content-Type': 'application/json',
              Authorization: user.jwt,
            },
          })
          const data = await req.json()
          return data
        }

        const getCart = async (): Promise<CartResponse> => {
          const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/cart/get-cart`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: user.jwt,
            },
          })
          const data = await req.json()
          return data
        }

        const updateCart = async (item_id: string, quantity: number) => {
          const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/cart/update-cart`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: user.jwt,
            },
            body: JSON.stringify({
              item_id,
              quantity,
            }),
          })
        }

        getCart().then(response => {
          if (response.success && cart.items.length > 0) {
            console.log(response, cart.items)
            response.data.data.itemDetails.map(item => {
              const isInCart = isProductInCart({
                id: item.item_id,
                title: '',
                layout: [],
                updatedAt: '',
                createdAt: '',
                stock: 0,
              })
              if (isInCart) {
                const cartItem = cart.items.find(c => c.id === item.item_id)
                if (cartItem.quantity > item.quantity) {
                  updateCart(cartItem.id, item.quantity)
                }
              }
            })
          }
        })

        // syncCartToPayload()
      } catch (e) {
        console.error('Error while syncing cart to Payload.') // eslint-disable-line no-console
      }
    } else {
      localStorage.setItem('cart', JSON.stringify(flattenedCart))
    }

    setHasInitialized(true)
  }, [user, authStatus]) // eslint-disable-line

  const isProductInCart = useCallback(
    (incomingProduct: Product): boolean => {
      let isInCart = false
      const { items: itemsInCart } = cart || {}
      if (Array.isArray(itemsInCart) && itemsInCart.length > 0) {
        isInCart = Boolean(
          itemsInCart.find(({ product }) =>
            typeof product === 'string'
              ? product === incomingProduct.id
              : product?.id === incomingProduct.id,
          ), // eslint-disable-line function-paren-newline
        )
      }
      return isInCart
    },
    [cart],
  )

  // local cart getting updated then update the same in database
  useEffect(() => {
    if (!hasInitialized || !user) return
    if (hasInitialized && user) {
    }
  }, [cart]) // eslint-disable-line

  // calculate the new cart total whenever the cart changes
  useEffect(() => {
    if (!hasInitialized) return

    const newTotal =
      cart?.items?.reduce((acc, item) => {
        return (
          acc +
          (typeof item.product === 'object'
            ? item?.product?.priceJSON * (typeof item?.quantity === 'number' ? item?.quantity : 0)
            : 0)
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
      }}
    >
      {children && children}
    </Context.Provider>
  )
}
