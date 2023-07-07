import {PRODUCTS_URL} from "../constants";
import {apiSlice} from "./apiSlice"

//to be able to make a query for http://localhost:5000/api/products (from the backend) and get the data
export const productsApiSlice = apiSlice.injectEndpoints({ //add endpoints to http://localhost:5000
  endpoints: (builder) => ({
    getProducts: builder.query({ //for useGetProductsQuery in the export part
      query: () => ({
        url: PRODUCTS_URL, //http://localhost:5000/api/products
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {useGetProductsQuery} = productsApiSlice; //Convention: use....Query in this case: use Products Query