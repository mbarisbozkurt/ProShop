import React from 'react'
import {useState, useEffect} from "react";
import {Table, Form, Button, Row, Col, FormGroup, FormLabel, FormControl} from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {toast} from "react-toastify";
import {FaTimes} from "react-icons/fa"

import { useProfileMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';


const ProfileScreen = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const userInfo = useSelector((state) => state.auth.userInfo);
  const dispatch = useDispatch();

  const [updateProfile, {isLoading: loadingUpdateProfile}] = useProfileMutation();
  const {data: orders, isLoading, error} = useGetMyOrdersQuery();

  console.log(orders);

  //whenever userInfo is changed, also update here
  useEffect(() => {
    if(userInfo){
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo, userInfo.name, userInfo.email])

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if(password !== confirmPassword){
      toast.error("Password do not match!")
    }else{
      try {

        //1)Backend: get the response from the backend and get the updatedData as response
        const res = await updateProfile({_id: userInfo._id, name, email, password}).unwrap();
  
        //2)Frontend: update the frontend (userInfo in the authSlice)
        dispatch(setCredentials(res));
        toast.success("Profile updated successfully!");
  
      } catch (error) {
        toast.error(error?.data?.message || error?.error);
      }
    }
  }

  return (
    <Row>
      <Col md={3}>  
          <Form onSubmit={onSubmitHandler}>
            <h2>User Profile</h2>

            <FormGroup controlId='username' className='my-3'>
              <FormLabel>Name</FormLabel>
              <FormControl type="name" placeholder='Enter name' value={name} onChange={(e)=> setName(e.target.value)}/>
            </FormGroup>

            <FormGroup controlId='email'className='my-3'>
              <FormLabel>Email Address</FormLabel>
              <FormControl type= "email" placeholder = "Enter email" value= {email} onChange={(e) => setEmail(e.target.value)} autocomplete="off"/>
            </FormGroup>

            
            <FormGroup controlId='password' className='my-3'>
              <FormLabel>Password</FormLabel>
              <FormControl type= "password" placeholder = "Enter password" value= {password} onChange={(e) => setPassword(e.target.value)} autocomplete="off"/>
            </FormGroup>

            
            <FormGroup controlId='confirmPassword' className='my-3'>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl type= "password" placeholder = "Confirm password" value= {confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autocomplete="off"/>
            </FormGroup>

            <Button type='submit'>Update</Button>
            {loadingUpdateProfile && <Loader/>}
          </Form>   
      </Col>

      <Col md={9}>
        <h2>My Orders</h2>
        {isLoading && <Loader/>}
        {error && <Message variant="danger">{error?.data?.message || error?.error}</Message>}
        <Table striped hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {orders && orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.createdAt.substring(0,10)}</td>
                <td>${order.totalPrice}</td>
                <td>{order.isPaid && order.paidAt.substring(0,10)} {!order.isPaid && <FaTimes style={{color: "red"}}/>} </td>
                <td>{order.isDelivered && order.deliveredAt.substring(0,10)} {!order.isDelivered && <FaTimes style={{color: "red"}}/>}</td>
                <td><LinkContainer to={`/order/${order._id}`}><Button variant="outline-primary">Details</Button></LinkContainer></td>
            </tr>
            ))}
          </tbody>
        </Table>
      </Col>
    </Row>
  )
}

export default ProfileScreen;