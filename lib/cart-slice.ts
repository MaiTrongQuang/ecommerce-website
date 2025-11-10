import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface CartItem {
  id: string
  product_id: string
  name: string
  slug: string
  price: number
  quantity: number
  image: string
  stock: number
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
}

const initialState: CartState = {
  items: [],
  isOpen: false,
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find((item) => item.product_id === action.payload.product_id)

      if (existingItem) {
        existingItem.quantity += action.payload.quantity
      } else {
        state.items.push(action.payload)
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.product_id !== action.payload)
    },
    updateQuantity: (state, action: PayloadAction<{ product_id: string; quantity: number }>) => {
      const item = state.items.find((item) => item.product_id === action.payload.product_id)
      if (item) {
        item.quantity = action.payload.quantity
      }
    },
    clearCart: (state) => {
      state.items = []
    },
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen
    },
    openCart: (state) => {
      state.isOpen = true
    },
    closeCart: (state) => {
      state.isOpen = false
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart, setCartItems, toggleCart, openCart, closeCart } =
  cartSlice.actions

export default cartSlice.reducer

// Selectors
export const selectCartItems = (state: { cart: CartState }) => state.cart.items
export const selectCartTotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0)
export const selectCartItemCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0)
export const selectIsCartOpen = (state: { cart: CartState }) => state.cart.isOpen
