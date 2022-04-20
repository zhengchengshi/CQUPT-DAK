import {createSlice } from '@reduxjs/toolkit'

export const currentMessageSlice = createSlice({
    name:'currentMessage',
    initialState:{
        obj:{}
    },
    reducers:{
        storageCurrentMessage:(state,action)=>{
            state.obj = action.payload
        }
    }
})
export const {storageCurrentMessage} = currentMessageSlice.actions

// export const selectCount = state => {console.log(state.value)}
export const selectCurrentMessage = state => state.currentMessage.obj
export default currentMessageSlice.reducer
