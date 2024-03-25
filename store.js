import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './src/reducers/notificationReducer'
import errorReducer from './src/reducers/errorReducer'
import blogReducer from './src/reducers/blogReducer'
import userReducer from './src/reducers/userReducer'

const store = configureStore({
    reducer: {
        notification: notificationReducer,
        error: errorReducer,
        blogs: blogReducer,
        user: userReducer,
    }
})

export default store
