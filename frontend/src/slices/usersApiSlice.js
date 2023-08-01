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

    getUsers: builder.query({ 
      query: () => ({
        url: USERS_URL, //  http://localhost:5000/api/users
      }),
      providesTags: ["Users"], //refresh the page
      keepUnusedDataFor: 5,
    }),

    deleteUser: builder.mutation({   
      query: (userId) => ({ 
        url: `${USERS_URL}/${userId}`, // /api/users/:id 
        method: "DELETE",
      }),
    }),

    ///////////////////////////////
    getUserById: builder.query({ 
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`, //  http://localhost:5000/api/users/:id  
      }),
      //providesTags: ["Users"], //refresh the page
      keepUnusedDataFor: 5,
    }),

    updateUser: builder.mutation({   
      query: (data) => ({ 
        url: `${USERS_URL}/${data.userId}`, // http://localhost:5000/api/users/:id
        method: "PUT",
        body: data,
      }),
    }),
    invalidatesTags: ["Users"],
  }),
});

export const {useLoginMutation, useLogoutMutation, useRegisterMutation, useProfileMutation, 
  useGetUsersQuery, useDeleteUserMutation, useGetUserByIdQuery, useUpdateUserMutation} = usersApiSlice; 
