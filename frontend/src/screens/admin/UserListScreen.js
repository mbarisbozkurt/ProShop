import React from 'react'
import { Row, Table, Button } from "react-bootstrap";
import { FaTimes, FaCheck, FaTrash, FaEdit } from 'react-icons/fa';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { LinkContainer } from 'react-router-bootstrap';
import { toast } from "react-toastify";
import { useGetUsersQuery, useDeleteUserMutation } from '../../slices/usersApiSlice';

const UserListScreen = () => {

  const {data: users, isLoading, error, refetch} = useGetUsersQuery();
  //console.log(users);

  const [deleteUser, {isLoading: loadingDelete}] = useDeleteUserMutation();

  const deleteHandler = async(id) => {
    //console.log(id);
    if(window.confirm("Are you sure?")){
      try {
        const result = await deleteUser(id).unwrap();
        toast.success(result.message);
        refetch();
      } catch (error) {
        toast.error(error?.data?.message || error?.error);
      }
    }
  }

  return (
    <Row>
      <h1>Users</h1>      
      {isLoading && <Loader/>}
      {error && <Message variant="danger">{error?.data?.message || error?.error}</Message>}
      {loadingDelete && <Loader/>}
      <Table striped hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>EMAIL</th>
            <th>ADMIN</th>
            <th></th>
          </tr>
        </thead>

        {users && users.map((user) => (
        <tbody>
          <tr key={user._id}>
            <td>{user._id}</td>
            <td>{user.name}</td>  
            <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
            <td>{user.isAdmin && <FaCheck style={{color: "green"}}/>} {!user.isAdmin && <FaTimes style={{color: "red"}}/>}</td>
            <td>
                <LinkContainer to={`/admin/user/${user._id}/edit`}>
                  <Button type='button' className='btn-md mx-2'><FaEdit/></Button> 
                </LinkContainer>
                
                <Button type='button' variant='danger' onClick={() => deleteHandler(user._id)}> <FaTrash style={{color: "white"}}/></Button>
            </td>
          </tr>
        </tbody>
        ))}
      </Table>
    </Row>
  )
}

export default UserListScreen