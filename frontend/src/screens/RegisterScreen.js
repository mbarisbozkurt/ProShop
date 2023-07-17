import React from 'react'
import {useState, useEffect} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import {Form, Button, Row, Col} from 'react-bootstrap';
import {toast} from "react-toastify";

import { useRegisterMutation } from '../slices/usersApiSlice'; //for backend
import { setCredentials } from '../slices/authSlice'; //for frontend
import { useSelector, useDispatch } from 'react-redux'; //for frontend

const RegisterScreen = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [register, {isLoading}] = useRegisterMutation(); //from backend: to be able to make a post request to the backend
  const userInfo = useSelector((state) => state.auth.userInfo) //from frontend //state.name.initialState 

  //redirect to /shipping or home page 
  const {search} = useLocation(); 
  const sp = new URLSearchParams(search); 
  const redirect = sp.get("redirect") || "/"; //get whatever the value after "redirect" e.g: http://localhost:3000/login?redirect=/shipping

  //whenever userInfo or redirect changed, if there is a user navigate him/her to /shipping or "/" (home page)
  useEffect(()=> {
    if(userInfo){
      navigate(redirect);
    }
  }, [userInfo, navigate, redirect])


  const submitHandler = async(event) => {
    event.preventDefault();
    if(password !== confirmPassword){
      toast.error("Password does not match!");
      return;
    }else{
      try {
        //get the response from the backend, use register() which comes from useRegisterMutation() and takes a parameter (updated with useState)
        //make a post request to: http://localhost:5000/api/users in the userController and get the response
        const res = await register({name, email, password}).unwrap();     
        //update frontend
        dispatch(setCredentials({...res}));
        //navigate 
        navigate(redirect); //redirect'den sonra "/" olduğu için homepage'e yönlendir
      } catch (error) {
        toast.error(error?.data?.message || error?.error);
      }
    }
  }
 
  return (
    <FormContainer> 
      <h1>Sign Up</h1> 
      <Form onSubmit={submitHandler}>
          <Form.Group controlId="name" className="my-3"> {/*margin y axis 3 (medium space)*/}
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)}/> {/*input*/}
          </Form.Group>


          <Form.Group controlId="email" className="my-3"> {/*margin y axis 3 (medium space)*/}
            <Form.Label>Email Address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)}/> {/*input*/}
          </Form.Group>

          <Form.Group controlId="password" className="my-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)}/> {/*input*/}
          </Form.Group>

          <Form.Group controlId="confirmPassword" className="my-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/> {/*input*/}
          </Form.Group>


          <Button type="submit" variant="primary" className="mt-2" disabled={isLoading}>Register</Button> {/*mt-2 margin top 2*/}
          {isLoading && <Loader/>}
      </Form>

      <Row className="py-3">
        <Col>
          Already have an account? {" "} <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}> Login</Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default RegisterScreen;