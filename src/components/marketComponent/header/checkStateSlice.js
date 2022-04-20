import { createSlice } from '@reduxjs/toolkit'

export const checkStateSlice = createSlice({
    name:'checkState',
    initialState:{
        obj:'market'
    },
    reducers:{
        storageCheckState:(state,action)=>{
            state.obj = action.payload
        }
    }
})
export const {storageCheckState} = checkStateSlice.actions

// export const selectCount = state => {console.log(state.value)}
export const selectCheckState = state => state.checkState.obj
export default checkStateSlice.reducer
