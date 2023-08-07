import {PRODUCTS_URL, UPLOAD_URL} from "../constants";
import {apiSlice} from "./apiSlice"

//for backend: to be able to make a query for http://localhost:5000/api/products (from the backend) and get the data
export const productsApiSlice = apiSlice.injectEndpoints({ //add endpoints to http://localhost:5000
  endpoints: (builder) => ({
    getProducts: builder.query({ //for useGetProductsQuery in the export part
      query: ({keyword, pageNumber}) => ({
        url: PRODUCTS_URL, //get data from here: http://localhost:5000/api/products
        params: {
          keyword,
          pageNumber,
        },
      }),
      providesTags: ["Products"], //refresh the page
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
        url: `${PRODUCTS_URL}/${data.productId}`, // /api/products/:id
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Products"], 
    }),

    uploadProductImage: builder.mutation({ 
      query: (data) => ({
        url: UPLOAD_URL, 
        method: "POST",
        body: data, 
      }),
    }),

    deleteProduct: builder.mutation({ 
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`, // /api/products/:id
        method: "DELETE",
      }),
    }),

    createReview: builder.mutation({ 
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}/reviews`, // POST /api/products/:id/reviews
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product"], //for fresh data
    }),

    getTopProducts: builder.query({ 
      query: () => ({
        url: `${PRODUCTS_URL}/top` //get data from here: http://localhost:5000/api/products/top
      }),
      keepUnusedDataFor: 5,
    }),    
  }),
});

//Convention: use....Query e.g: use Products Query
export const {useGetProductsQuery, useGetProductDetailsQuery, useCreateProductMutation, useUpdateProductMutation, 
  useUploadProductImageMutation, useDeleteProductMutation, useCreateReviewMutation, useGetTopProductsQuery} = productsApiSlice; 