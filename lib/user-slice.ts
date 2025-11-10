import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface UserPreferences {
  currency: string
  language: string
  theme: "light" | "dark" | "system"
}

interface UserState {
  preferences: UserPreferences
  recentlyViewed: string[] // product IDs
}

const initialState: UserState = {
  preferences: {
    currency: "USD",
    language: "en",
    theme: "system",
  },
  recentlyViewed: [],
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setPreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      state.preferences = { ...state.preferences, ...action.payload }
    },
    addRecentlyViewed: (state, action: PayloadAction<string>) => {
      // Remove if already exists
      state.recentlyViewed = state.recentlyViewed.filter((id) => id !== action.payload)
      // Add to beginning
      state.recentlyViewed.unshift(action.payload)
      // Keep only last 10
      state.recentlyViewed = state.recentlyViewed.slice(0, 10)
    },
    clearRecentlyViewed: (state) => {
      state.recentlyViewed = []
    },
  },
})

export const { setPreferences, addRecentlyViewed, clearRecentlyViewed } = userSlice.actions

export default userSlice.reducer

// Selectors
export const selectPreferences = (state: { user: UserState }) => state.user.preferences
export const selectRecentlyViewed = (state: { user: UserState }) => state.user.recentlyViewed
