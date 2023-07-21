import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../utils/cartUtils";

//if there is an item before, get it; if not, ***initialize empty array
const initialState = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) 
: {cartItems: [], shippingAddress: {}, paymentMethod: ""}; 

const cartSlice = createSlice({
  name: "cart", //to be able to cartItems with useSelector: state.cart.cartItems
  initialState,
  reducers:{
    addToCart: (state, action) => {
      const item = action.payload; //new item
      const existItem = state.cartItems.find((x) => x._id === item._id); //check if there is a same item in cartItems 
      if(existItem){
        state.cartItems = state.cartItems.map((x) => x._id === existItem._id ? item : x) //if there is a same item, refresh them with new one (because we want to add only new one)
      }else{
        state.cartItems = [...state.cartItems, item]; //copy of old items + new item
      }

      return updateCart(state); 
    },

    removeFromCart: (state, action) => {
      const willbeRemovedItem = action.payload;
      state.cartItems = state.cartItems.filter((x) => x._id !== willbeRemovedItem._id);
      return updateCart(state); 
    },

    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      return updateCart(state);
    },

    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      return updateCart(state);
    },

    clearCartItems: (state, action) => {
      state.cartItems = [];
      return updateCart(state);
    } 
  },
});

export const {addToCart, removeFromCart, saveShippingAddress, savePaymentMethod, clearCartItems} = cartSlice.actions;

export default cartSlice.reducer;