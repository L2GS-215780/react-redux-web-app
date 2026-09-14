import { configureStore } from '@reduxjs/toolkit'
import authReducer from './feature/auth/authSlice'
import usersReducer from './feature/users/usersSlice'
import messageBoardReducer from './feature/message board/messageBoardSlice'

const store = configureStore({
    reducer: {
        auth: authReducer,
        users: usersReducer,
        messageBoard: messageBoardReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store