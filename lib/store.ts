import { configureStore } from "@reduxjs/toolkit"
import cartReducer from "./cart-slice"
import userReducer from "./user-slice"
import productsReducer from "./products-slice"

export const makeStore = () => {
  return configureStore({
    reducer: {
      cart: cartReducer,
      user: userReducer,
      products: productsReducer,
    },
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]
