import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    asset: [],
}

const cryptoSlice = createSlice({
    name : 'crypto',
    initialState,
    reducers:{
        updatePrice:(state,action)=>{
            const index = state.asset.findIndex(asset=>asset.symbol === action.payload.symbol)
            if(index !== -1){
                state.asset[index] = {...state.asset[index],...action.payload}
            }
            else {
                state.asset.push(action.payload);
              }
        }
    }
})

export const {updatePrice} = cryptoSlice.actions
export default cryptoSlice.reducer