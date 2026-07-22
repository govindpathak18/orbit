import { createSlice } from '@reduxjs/toolkit'
// import { act } from 'react'

const initialState = {
  userData:null
}

export const userSlice = createSlice({
  name: 'user',
  initialState, // The initial state of the user slice
  reducers: { // The reducers means the actions that can be performed on the state
    setUserData:( state, action )=>{
        state.userData = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const {setUserData} = userSlice.actions

export default userSlice.reducer