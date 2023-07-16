import {USERS_URL} from "../constants";
import {apiSlice} from "./apiSlice"

//for backend: make a post request to: http://localhost:5000/api/users/auth 
export const usersApiSlice = apiSlice.injectEndpoints({ //add endpoints to http://localhost:5000
  endpoints: (builder) => ({
    login: builder.mutation({  //mutation for post request
      query: (data) => ({ //data: email and password
        url: USERS_URL/auth, //http://localhost:5000/api/users/auth 
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {useLoginMutation} = usersApiSlice; 