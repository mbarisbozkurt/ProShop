import React from 'react'
import {Link, useNavigate} from "react-router-dom";
import {Row, Col, Image, Form, ListGroup, Card, Button, ListGroupItem} from "react-bootstrap"
import {FaTrash} from "react-icons/fa"
import Message from '../components/Message';
import { useDispatch, useSelector } from 'react-redux';
import CardHeader from 'react-bootstrap/esm/CardHeader';
import { addToCart, removeFromCart } from '../slices/cartSlice';

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //get all items
  const allItems = useSelector((state) => state.cart.cartItems); 

  const itemAmountHandler = async (item, qty) => { 
    dispatch(addToCart({...item, qty})); //send the item as the action but only change the quantity (qty)
  }

  const deleteItemHandler = async(item) => {
    dispatch(removeFromCart(item)); //send the item as the action
  } 

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  }
 
  return (
    <Row> 
      <Col md={8}> {/* 8 out of 12*/}
        <h1 style={{marginBottom:"20px"}}>Shopping Cart</h1>
        {allItems.length === 0 && <Message> Your cart is empty! <Link to="/">Go Back </Link> </Message>}
        <ListGroup variant='flush'>
          {allItems.map((item) => (
            <ListGroupItem key={item.id}>
              <Row>

                <Col md={2}>
                  <Image src={item.image} alt={item.name} fluid rounded/>
                </Col>

                <Col md={3}>
                  <Link to={`/product/${item._id}`}>{item.name}</Link>
                </Col>

                <Col md={2}>
                  ${item.price}
                </Col>

                <Col md={2}>
                  <Form.Control
                    as="select"
                    value={item.qty}
                    onChange={(event) => itemAmountHandler(item, Number(event.target.value))}>
                    {[...Array(item.countInStock).keys()].map((x) => ( //User'ın ekleyebileceği ürün miktarını gösterebilmek için
                      <option key={x+1} value={x+1}>
                        {x+1}
                      </option>
                    ))}
                  </Form.Control>
                </Col>

                <Col md={3}>
                  <Button type='button' variant='light' onClick={() => deleteItemHandler(item)} > {/*important to add () => always */}
                    <FaTrash/>
                  </Button>
                </Col>

              </Row>
            </ListGroupItem>
          ))}
        </ListGroup>
      </Col>

      <Col md={4}> {/*Remaining 4 out of 12*/} 
        <Card>
          <CardHeader>
            <h3>
              {`Subtotal (${allItems.reduce((totalItem, item) => totalItem + item.qty, 0)}) Items`}
            </h3>
            ${`${allItems.reduce((totalCost, item) => totalCost + (item.qty * item.price), 0).toFixed(2)}`}
          </CardHeader>
          
          <Card.Body>
            <Button type='button' className='btn btn-block' disabled={allItems.length === 0} onClick={checkoutHandler}>Proceed To Checkout</Button>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

export default CartScreen;