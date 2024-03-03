import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface rtParamsState {
  dia: number,
  thick: number,
  focus: number,
  type: string,
  iqi: number,
  ug: number,
  cap: number,
  diaMM: number,
}

const initialState: rtParamsState = {
  dia: 0,
  thick: 0,
  focus: 0,
  type: '',
  iqi: 0,
  ug: 0,
  cap: 1.5,
  diaMM: 0
};  

export const rtParams = createSlice({
  name: 'rtParams',
  initialState,
  reducers: {
    
    setDia: (state: any, action: PayloadAction<number>) =>{
      state.dia = action.payload
    },
    setThick: (state: any, action: PayloadAction<number>) =>{
      state.thick = action.payload
    },
    setFocus: (state: any, action: PayloadAction<number>) =>{
      state.focus = action.payload
    },
    setType: (state: any, action: PayloadAction<string>) =>{
      state.type = action.payload
    },
    setIqi: (state: any, action: PayloadAction<number>) =>{
      state.iqi = action.payload
    },
    setUg: (state: any, action: PayloadAction<number>) =>{
      state.ug = action.payload
    },
    setCap: (state: any, action: PayloadAction<number>) =>{
      state.cap = action.payload
    },
    setDiaMM: (state: any, action: PayloadAction<number>) =>{
      state.diaMM = action.payload
    },


  },
});

export const {setDia, setThick, setFocus, setType, setIqi, setUg, setCap, setDiaMM} = rtParams.actions
export default rtParams.reducer
