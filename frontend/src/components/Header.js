import React from 'react'
import {Badge, Navbar, Nav, Container, NavDropdown} from "react-bootstrap";
import {FaShoppingCart, FaUser} from "react-icons/fa"
import logo from "../assets/logo.png"
import {LinkContainer} from "react-router-bootstrap"
import { useNavigate } from 'react-router-dom';

import {useLogoutMutation} from '../slices/usersApiSlice'; //for backend
import {logout} from '../slices/authSlice'; //for frontend
import {useDispatch, useSelector} from "react-redux"; //for frontend

const Header = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
   
  const quantity = useSelector((state) => state.cart.cartItems.reduce((total, item) => total + item.qty, 0)); //total += item.qty (total is initially 0)

  const userInfo = useSelector((state) => state.auth.userInfo); //from frontend
  const [logoutBackendApiCall] = useLogoutMutation(); //from backend

  const logoutHandler = async() => {
   try {
      //get the response from the backend
      //make a post request to: http://localhost:5000/api/users/logout in the userController
      await logoutBackendApiCall().unwrap();

      //set the response to frontend(local storage)
      dispatch(logout());

      //navigate
      navigate("/login");

   } catch (error) {
      console.log(error);
   }
  } 

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="md" collapseOnSelect>
         <Container>
            <LinkContainer to="/">
               <Navbar.Brand>
                  <img src={logo} alt="ProShop"/>
                  ProShop
               </Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle aria-controls='basic-navbar-nav'/>
            <Navbar.Collapse id='basic-navbar-nav'>
               <Nav className='ms-auto'>
                  <LinkContainer to="/cart">
                     <Nav.Link>
                        <FaShoppingCart/>Cart 
                        <Badge pill bg='success' style={{marginLeft: "5px"}}>
                           {quantity > 0 && quantity}
                        </Badge>
                     </Nav.Link>
                  </LinkContainer>

                  {userInfo ? 
                  (<NavDropdown title={userInfo.name} id="username">
                        <LinkContainer to="/profile">
                           <NavDropdown.Item>Profile</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/logout">
                           <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                        </LinkContainer>
                  </NavDropdown>) 
                  : 
                  (<LinkContainer to="login">
                     <Nav.Link>
                        <FaUser/>Sign In
                     </Nav.Link>
                  </LinkContainer>)}

                  {userInfo && userInfo.isAdmin && 
                     (<NavDropdown title="Admin" id="adminmenu">

                        <LinkContainer to="/admin/productlist">
                           <NavDropdown.Item>Products</NavDropdown.Item>
                        </LinkContainer>

                        <LinkContainer to="/admin/userlist">
                           <NavDropdown.Item>Users</NavDropdown.Item>
                        </LinkContainer>

                        <LinkContainer to="/admin/orderlist">
                           <NavDropdown.Item>Orders</NavDropdown.Item>
                        </LinkContainer>

                     </NavDropdown>) 
                  }
               </Nav>
            </Navbar.Collapse> 
         </Container>
      </Navbar>
    </header>
  )
}

export default Header;