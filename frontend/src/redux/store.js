import { configureStore } from '@reduxjs/toolkit'
import userSlice from './user.slice.js'
import conversationSlice from './conversationSlice.js'
import messageSlice from './messageSlice.js'

export const store = configureStore({
  reducer: {
    user: userSlice,
    conversation: conversationSlice,
    message: messageSlice,
  },
})

// useDispatch and useSelector hooks are used to access the store in the components.
// useDispatch is used to dispatch actions to the store 
// useSelector is used to select data from the store.