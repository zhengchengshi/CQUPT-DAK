import { createSlice } from '@reduxjs/toolkit'

export const verifySlice = createSlice({
    name:'verifyState',
    initialState:{
        flag:false
    },
    reducers:{
        storageVerifyState:(state,action)=>{
            state.flag = action.payload
        }
    }
})
export const {storageVerifyState} = verifySlice.actions

// export const selectCount = state => {console.log(state.value)}
export const selectVerifyState = state => state.verifyState.flag
export default verifySlice.reducer
