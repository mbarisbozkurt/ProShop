import {USERS_URL} from "../constants";
import {apiSlice} from "./apiSlice"

//for interacting with backend: make a post request to: http://localhost:5000/api/users/auth 
export const usersApiSlice = apiSlice.injectEndpoints({ //add endpoints to http://localhost:5000
  endpoints: (builder) => ({
    login: builder.mutation({ //mutation for post request
      query: (data) => ({ //data: email and password
        url: `${USERS_URL}/auth`, //make a post request to: http://localhost:5000/api/users/auth 
        method: "POST",
        body: data, //taken in the authUser() function in the userController: const {email, password} = req.body;
      }),
    }),

    register: builder.mutation({ 
      query: (data) => ({ 
        url: `${USERS_URL}`, //make a post request to: http://localhost:5000/api/users
        method: "POST",
        body: data, 
      }),
    }),

    logout: builder.mutation({  
      query: () => ({ 
        url: `${USERS_URL}/logout`, //make a post request to: http://localhost:5000/api/users/logout in the userController
        method: "POST",
      }),
    }),

    
    profile: builder.mutation({   
      query: (data) => ({ 
        url: `${USERS_URL}/profile`, //make a PUT request to: http://localhost:5000/api/users/profile in the userController
        method: "PUT",
        body: data, 
      }),
    }),
  }),
});

export const {useLoginMutation, useLogoutMutation, useRegisterMutation, useProfileMutation} = usersApiSlice; 
