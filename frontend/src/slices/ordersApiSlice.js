import {ORDERS_URL, PAYPAL_URL} from "../constants"; // ORDERS_URL = /api/orders
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

    payOrder: builder.mutation({
      query: ({orderId, details}) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: "PUT",
        body: {...details},
      }),
    }),

    getPayPalClientId: builder.query({ 
      query: () => ({ 
        url: PAYPAL_URL,
      }),
      keepUnusedDataFor: 5
    }),

    getMyOrders: builder.query({ 
      query: () => ({ 
        url: `${ORDERS_URL}/mine`,
      }),
      keepUnusedDataFor: 5
    }),

    getOrders: builder.query({ 
      query: () => ({ 
        url: ORDERS_URL,
      }),
      keepUnusedDataFor: 5
    }),

    //PUT /api/orders/:id/deliver
    deliverOrder: builder.mutation({ 
      query: (orderId) => ({ 
        url: `${ORDERS_URL}/${orderId}/deliver`, //make a put request to: http://localhost:5000/api/orders/:id/deliver
        method: "PUT",
      }),
    }),
  }),
});

export const {useCreateOrderMutation, useGetOrderDetailsQuery, usePayOrderMutation, useGetPayPalClientIdQuery, 
  useGetMyOrdersQuery, useGetOrdersQuery, useDeliverOrderMutation} = ordersApiSlice; 


