import React from 'react';
import { useEffect } from 'react';
import {Link, useNavigate} from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import {Row, Col, Button, ListGroup, Image, Card, ListGroupItem} from "react-bootstrap";
import CheckoutSteps from '../components/CheckoutSteps';
import {toast} from "react-toastify";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart)
  const cartItems = cart.cartItems;

  useEffect(() => {
    if(!cart.shippingAddress.address){
      navigate("/shipping");
    }else if (!cart.paymentMethod){
      navigate("/payment");
    }else{
      navigate("/placeholder");
    }
  }, [cart.shippingAddress.address, cart.paymentMethod, navigate])

  //get the createOrder function from apiSlice for interacting with backend
  const [createOrder, {isLoading, error}] = useCreateOrderMutation();

  const placeHolderHandler = async () => {
    try {
        //send the order items to backend and get the response from there
        const res = await createOrder({
          orderItems: cart.cartItems, //check redux in the browser
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          taxPrice: cart.taxPrice,
          shippingPrice: cart.shippingPrice,
          totalPrice: cart.totalPrice
        }).unwrap();

        //console.log(res); 

        //clear the cartItems since items are about to delivered
        dispatch(clearCartItems());

        //navigate
        navigate(`/order/${res._id}`);

    } catch (error) {
      toast.error(error);
    }
  }

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <Row>
            <ListGroup variant="flush">

              <ListGroupItem>
                <h2>Shipping</h2>             
                <strong>Address:</strong> {cart.shippingAddress.address}, {cart.shippingAddress.city}, {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
              </ListGroupItem>


              <ListGroupItem>
                <h2>Payment Method</h2>
                <strong>Method:</strong> {cart.paymentMethod}
              </ListGroupItem>
              
              <ListGroupItem>
              <h2>Order Items</h2>
              {cartItems.map((item, index) => (
                <ListGroupItem key={index} variant='flush'>
                  <Row>
                    <Col md={2}>
                      <Image src={item.image} rounded style={{width: '100%', height: '100px'}}/>
                    </Col>

                    <Col md={4}>
                      <Link to={`/product/${item._id}`}>
                        {item.name}    
                      </Link>                       
                    </Col>

                    <Col md={4}>
                      {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                    </Col>
                  </Row>
                </ListGroupItem>
              ))}
              </ListGroupItem>
              
            </ListGroup>            
          </Row>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Header><h3>Order Summary</h3></Card.Header>
            <ListGroup variant='flush'>

                <ListGroupItem>
                  <Row>
                    <Col>Items:</Col>
                    <Col>${cart.itemsPrice}</Col>
                  </Row>
                </ListGroupItem>

                <ListGroupItem>
                  <Row>
                    <Col>Shipping:</Col>
                    <Col>${cart.shippingPrice}</Col>
                  </Row>
                </ListGroupItem>
                  
                <ListGroupItem>
                  <Row>
                    <Col>Tax:</Col>
                    <Col>${cart.taxPrice}</Col>
                  </Row>
                </ListGroupItem>

                <ListGroupItem>
                  <Row>
                    <Col>Total:</Col>
                    <Col>${cart.totalPrice}</Col>
                  </Row>
                </ListGroupItem>
                
                <ListGroupItem>
                  {error && <Message variant="danger"> {error.message} </Message>}
                </ListGroupItem>

                <ListGroupItem>
                  <Button type="button" className='btn-block' disabled={cart.cartItems.length === 0} onClick={placeHolderHandler}>Place Order</Button>
                </ListGroupItem>
                
                {isLoading && <Loader/>}
            </ListGroup>

          </Card>
        </Col>
      </Row>
    </>
  )
}

export default PlaceOrderScreen;