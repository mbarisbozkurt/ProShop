import {ORDERS_URL} from "../constants"; // ORDERS_URL = /api/orders
import {apiSlice} from "./apiSlice"

//for interacting with backend: make requests to: http://localhost:5000/api/orders
export const ordersApiSlice = apiSlice.injectEndpoints({ //add endpoints to http://localhost:5000
  endpoints: (builder) => ({
    createOrder: builder.mutation({ 
      query: (order) => ({ 
        url: ORDERS_URL, //make a post request to: http://localhost:5000/api/orders
        method: "POST",
        body: {...order},
      }),
    }),

    getOrderDetails: builder.query({ //query for get requests
      query: (orderId) => ({ 
        url: `${ORDERS_URL}/${orderId}`, //make a get request to: http://localhost:5000/api/orders/:id
      }),
      keepUnusedDataFor: 5
    }),
  }),
});

export const {useCreateOrderMutation, useGetOrderDetailsQuery} = ordersApiSlice; 