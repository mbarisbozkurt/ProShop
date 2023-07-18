import React from 'react'
import { useState, useEffect } from 'react'
import FormContainer from '../components/FormContainer'
import {Form, Button, Col} from "react-bootstrap";
import CheckoutSteps from '../components/CheckoutSteps';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { savePaymentMethod } from '../slices/cartSlice';

const PaymentScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState("Paypal");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  //if there is no shipping address in the state, then user should be redirected to /shipping
  const shippingAddress = useSelector((state) => state.cart.shippingAddress);

  useEffect(() => {
    if(!shippingAddress){
      navigate("/shipping");
    }
  }, [shippingAddress, navigate])

  const submitHandler = (event) => {
    event.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeholder")
  }

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='Payment'>
          <Form.Label as="legend" className='mt-4'>Select Method</Form.Label>
          <Col>
            <Form.Check 
              type="radio"
              className="my-3"
              label="Paypal or Credit Card"
              id="Paypal"
              name="paymentMethod"
              value="Paypal"
              checked
              onChange={(e)=>{setPaymentMethod(e.target.value)}}
            />
          </Col>
        </Form.Group>
        <Button type="submit" variant='primary'>
          Continue
        </Button>
      </Form>
    </FormContainer>
  )
}

export default PaymentScreen