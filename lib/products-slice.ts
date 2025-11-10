import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  compare_at_price: number | null
  images: string[]
  category_id: string | null
  quantity: number
  status: string
}

interface ProductsState {
  items: Product[]
  featured: Product[]
  loading: boolean
  error: string | null
  filters: {
    category: string | null
    search: string
    minPrice: number | null
    maxPrice: number | null
    sort: string
  }
}

const initialState: ProductsState = {
  items: [],
  featured: [],
  loading: false,
  error: null,
  filters: {
    category: null,
    search: "",
    minPrice: null,
    maxPrice: null,
    sort: "created_at",
  },
}

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload
      state.loading = false
      state.error = null
    },
    setFeaturedProducts: (state, action: PayloadAction<Product[]>) => {
      state.featured = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.loading = false
    },
    setFilters: (state, action: PayloadAction<Partial<ProductsState["filters"]>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    resetFilters: (state) => {
      state.filters = initialState.filters
    },
  },
})

export const { setProducts, setFeaturedProducts, setLoading, setError, setFilters, resetFilters } =
  productsSlice.actions

export default productsSlice.reducer

// Selectors
export const selectProducts = (state: { products: ProductsState }) => state.products.items
export const selectFeaturedProducts = (state: { products: ProductsState }) => state.products.featured
export const selectProductsLoading = (state: { products: ProductsState }) => state.products.loading
export const selectProductsError = (state: { products: ProductsState }) => state.products.error
export const selectFilters = (state: { products: ProductsState }) => state.products.filters
