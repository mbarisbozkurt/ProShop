import {PRODUCTS_URL} from "../constants";
import {apiSlice} from "./apiSlice"

//for backend: to be able to make a query for http://localhost:5000/api/products (from the backend) and get the data
export const productsApiSlice = apiSlice.injectEndpoints({ //add endpoints to http://localhost:5000
  endpoints: (builder) => ({
    getProducts: builder.query({ //for useGetProductsQuery in the export part
      query: () => ({
        url: PRODUCTS_URL, //get data from here: http://localhost:5000/api/products
      }),
      providesTags: ["Products"], //not the refresh the page
      keepUnusedDataFor: 5,
    }),

    getProductDetails: builder.query({ 
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}` //get data from here: http://localhost:5000/api/products/id
      }),
      keepUnusedDataFor: 5,
    }),

    createProduct: builder.mutation({ 
      query: () => ({
        url: PRODUCTS_URL, 
        method: "POST",
      }),
      invalidatesTags: ["Product"], //for fresh data
    }),

    updateProduct: builder.mutation({ 
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}`, //api/products/:id
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Products"], 
    }),
  }),
});

export const {useGetProductsQuery, useGetProductDetailsQuery, useCreateProductMutation, useUpdateProductMutation} = productsApiSlice; //Convention: use....Query in this case: use Products Query