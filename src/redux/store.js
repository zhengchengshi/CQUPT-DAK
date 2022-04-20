import { configureStore } from '@reduxjs/toolkit'
import checkStateSliceReducer from '../components/marketComponent/header/checkStateSlice'
import messageListSliceReducer from '../messageListSlice'
import currentMessageSliceReducer from '../currentMessageSlice'
import verifyStateReducer from '../components/login/verifySlice'
const store = configureStore({
    reducer:{
        checkState:checkStateSliceReducer,
        messageList:messageListSliceReducer,
        currentMessage:currentMessageSliceReducer,
        verifyState:verifyStateReducer
    },
})

export default store