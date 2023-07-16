import {PRODUCTS_URL} from "../constants";
import {apiSlice} from "./apiSlice"

//for backend: to be able to make a query for http://localhost:5000/api/products (from the backend) and get the data
export const productsApiSlice = apiSlice.injectEndpoints({ //add endpoints to http://localhost:5000
  endpoints: (builder) => ({
    getProducts: builder.query({ //for useGetProductsQuery in the export part
      query: () => ({
        url: PRODUCTS_URL, //get data from here: http://localhost:5000/api/products
      }),
      keepUnusedDataFor: 5,
    }),
    getProductDetails: builder.query({ //for useGetProductsQuery in the export part
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}` //get data from here: http://localhost:5000/api/products/id
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {useGetProductsQuery, useGetProductDetailsQuery} = productsApiSlice; //Convention: use....Query in this case: use Products Query