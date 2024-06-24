import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isAuth: false,
    user: {},
    token: '',
}

export const counterSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.isAuth = true
            state.user = action.payload.user
            state.token = action.payload.token
        },
        logout: (state) => {
            state.isAuth = false
            state.user = {}
            state.token = ''
        },
        updateUser: (state, action) => {
            state.user = action.payload
        }
    },
})

// Action creators are generated for each case reducer function
export const { login, logout,updateUser } = counterSlice.actions

export default counterSlice.reducer