import { createSlice } from '@reduxjs/toolkit';



const initialState = {
  dia: 0,
};

export const rtParams = createSlice({
  name: 'rtParams',
  initialState,
  reducer: {
    increment: (state) => {
      state.value += 1;
    },
  },
});

export const {increment} = rtParams.actions
export default rtParams.reducer
