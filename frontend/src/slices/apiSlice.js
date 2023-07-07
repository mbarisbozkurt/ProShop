import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {BASE_URL} from "../constants.js";

const baseQuery = fetchBaseQuery({baseUrl: BASE_URL});

//apiSlice is parent for other routes
export const apiSlice = createApi({
  baseQuery, //http://localhost:5000 (root "/")
  tagTypes: ["Product", "Order", "User"],
  endpoints: (builder) => ({}) //endpoints to: //http://localhost:5000
})