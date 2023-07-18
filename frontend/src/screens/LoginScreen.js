import React from 'react'
import {useState, useEffect} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import {Form, Button, Row, Col} from 'react-bootstrap';
import {toast} from "react-toastify";

import { useLoginMutation } from '../slices/usersApiSlice'; //for backend
import { setCredentials } from '../slices/authSlice'; //for frontend
import { useSelector, useDispatch } from 'react-redux'; //for frontend

const LoginScreen = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login, {isLoading}] = useLoginMutation(); //from backend(apiSlice): to be able to make a post request to the backend
  const userInfo = useSelector((state) => state.auth.userInfo) //from frontend(authSlice) //state.name.initialState 

  //redirect to /shipping or home page 
  const {search} = useLocation(); 
  const sp = new URLSearchParams(search); 
  const redirect = sp.get("redirect") || "/"; //get whatever the value after "redirect" e.g: http://localhost:3000/login?redirect=/shipping => shipping

  //whenever userInfo or redirect changed navigate him/her to /shipping or "/" (home page)
  useEffect(()=> {
    if(userInfo){
      navigate(redirect);
    }
  }, [userInfo, navigate, redirect])

  const submitHandler = async(event) => {
    event.preventDefault();

    try {
      //get the response from the backend, use login() which comes from useLoginMutation() and takes a parameter (updated with useState)
      //make a post request to: http://localhost:5000/api/users/auth in the userController and get the response
      const res = await login({email, password}).unwrap();
      
      //update frontend
      dispatch(setCredentials({...res}));

      //navigate the value after "redirect"
      navigate(redirect);
       
    } catch (error) {
      toast.error(error?.data?.message || error?.error);
    }
  }
 
  return (
    <FormContainer> 
      <h1>Sign In</h1> 
      <Form onSubmit={submitHandler}>
          <Form.Group controlId="email" className="my-3"> {/*margin y axis 3 (medium space)*/}
            <Form.Label>Email Address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)}/> {/*input*/}
          </Form.Group>

          <Form.Group controlId="password" className="my-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)}/> {/*input*/}
          </Form.Group>

          <Button type="submit" variant="primary" className="mt-2" disabled={isLoading}>Sign In</Button> {/*mt-2 margin top 2*/}
          {isLoading && <Loader/>}
      </Form>

      <Row className="py-3">
        <Col>
          New Customer?{" "}<Link to={redirect ? `/register?redirect=${redirect}` : "/register"}> Register</Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default LoginScreen;