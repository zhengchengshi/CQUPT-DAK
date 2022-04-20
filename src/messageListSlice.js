import {createSlice } from '@reduxjs/toolkit'

export const messageListSlice = createSlice({
    name:'messageList',
    initialState:{
        list:[]
    },
    reducers:{
        storageMessageList:(state,action)=>{
            state.list = action.payload
        }
    }
})
export const {storageMessageList} = messageListSlice.actions

// export const selectCount = state => {console.log(state.value)}
export const selectMessageList = state => state.messageList.list
export default messageListSlice.reducer
