import {configureStore,createSlice} from '@reduxjs/toolkit';

//slice
const authSlice=createSlice({
  name:'auth',
  initialState:{email:'',isLoggedIn:false},
  reducers:{
    //login
    login:(state,action)=>{
        state.email=action.payload;
        state.isLoggedIn=true;
    },
    //logout
    logout:(state)=>{
      state.email='';
        state.isLoggedIn=false;
    }
  }
});

export const {login,logout}=authSlice.actions;

//store
const store=configureStore({reducer:{auth:authSlice.reducer}});

export default store;
