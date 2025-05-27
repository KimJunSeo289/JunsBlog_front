import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: { user: null, isAuthChecked: false },
  reducers: {
    setUserInfo: (state, action) => {
      state.user = action.payload
      state.isAuthChecked = true
    },
    clearUserInfo: state => {
      state.user = null
      state.isAuthChecked = true
    },
  },
})

export const { setUserInfo, clearUserInfo } = userSlice.actions
export default userSlice.reducer
