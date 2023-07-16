import React from 'react'
import {useState} from "react";
import {Link} from "react-router-dom";
import FormContainer from '../components/FormContainer';
import { Form, Button, Row, Col } from 'react-bootstrap';

const LoginScreen = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = (event) =>{
    event.preventDefault();
    console.log("submit");
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

          <Button type="submit" variant="primary" className="mt-2">Sign In</Button> {/*mt-2 margin top 2*/}
      </Form>

      <Row className="py-3">
        <Col>
          New Customer? <Link to="/register">Register</Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default LoginScreen;