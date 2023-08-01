import React, { useEffect, useState } from 'react'
import { LinkContainer } from 'react-router-bootstrap';
import {Button, Form, FormGroup, FormLabel, FormControl, FormCheck} from "react-bootstrap";
import FormContainer from '../../components/FormContainer';
import { useParams } from 'react-router-dom';
import { useGetUserByIdQuery, useUpdateUserMutation } from '../../slices/usersApiSlice';
import {toast} from "react-toastify";
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { useNavigate } from 'react-router-dom';

//HIT REFRESH IF THERE IS AN ISSUE
const UserEditScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  //Get the userId to update the user
  const {id: userId} = useParams();
  //console.log(userId);

  //Get the current user info by using userId to show it in the form
  const {data: user, isLoading: userLoading, error, refetch} = useGetUserByIdQuery(userId);
  //console.log(user);

  //Write the user info to the form directly
  useEffect(() => {
    if(user){
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  },[user])

  /*********************************************************************************/

  //Get updateUser function from usersApiSlice
  const [updateUser, {isLoading: updateLoading}] = useUpdateUserMutation();
  const navigate = useNavigate();

  const submitHandler = async(event) => {
    event.preventDefault();
    try {
      const updatedUser = {userId, name, email, isAdmin}; //updated with useState and will be sent to backend with updateUser 
      await updateUser(updatedUser);
      toast.success("User information updated successfully!");
      refetch();
      navigate("/admin/userlist");
    } catch (error) {
      toast.error(error?.data?.message || error?.error);
    }
  }

  return (
  <>
    <LinkContainer to={"/admin/userlist"}>
      <Button className='btn btn-light my-3'>Go Back</Button>
    </LinkContainer>

    <FormContainer>
      {userLoading && <Loader/>}
      {error && <Message variant="danger">{error?.data?.message || error?.error}</Message>}
      <Form onSubmit={submitHandler}>
        <h1>Edit User</h1>
        <FormGroup controlId='name' className='my-3'>
          <FormLabel>Name</FormLabel>
          <FormControl type='text' placeholder='Enter name' value={name} onChange={(e) => setName(e.target.value)}/>
        </FormGroup>

        <FormGroup controlId="email" className='my-3'>
          <FormLabel>Email</FormLabel>
          <FormControl type="text" placeholder='Enter email' value={email} onChange={(e) => setEmail(e.target.value)} />
        </FormGroup>

        <FormGroup controlId="isAdmin" className='my-3'>
          <FormCheck 
            type="checkbox" 
            label="Is Admin" 
            checked={isAdmin} 
            onChange={(e) => setIsAdmin(e.target.checked)}
          />
        </FormGroup>
        <Button type='submit' className='my-2'>Update</Button>
        {updateLoading && <Loader/>}
      </Form>
    </FormContainer>
  </>
  )
}

export default UserEditScreen;


