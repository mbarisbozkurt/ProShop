import React from 'react'
import {Link, useParams} from "react-router-dom";
import {Row, Col, ListGroup, Image, Button, Card, ListGroupItem} from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useGetOrderDetailsQuery } from "../slices/ordersApiSlice";
import CardHeader from 'react-bootstrap/esm/CardHeader';

const OrderScreen = () => {

  //get the orderId from the url
  const {id: orderId} = useParams();

  //get the data from the backend by using the orderId
  const{data: order, refetch, isLoading, error} = useGetOrderDetailsQuery(orderId);
  //console.log(order)

  return (
    isLoading ? <Loader/> : error ? <Message variant="danger"/> : 
    (
      <>
        {/*<p>asdasasd</p>*/}
        <h1>Order: {order._id}</h1>
        <Row>
          <Col md={8}>
            <ListGroup variant='flush'>
              <ListGroupItem>
                <h2>Shipping</h2>
                <p><strong>Name:</strong> {order.user.name}</p>
                <p><strong>Email:</strong> {order.user.email}</p>
                <p>
                  <strong>Adress: </strong> 
                  {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                </p>
                {order.isDelivered && <Message variant="success">Delivered on {order.updatedAt}</Message>}
                {!order.isDelivered && <Message variant="danger">Not Delivered</Message>}
              </ListGroupItem>

              <ListGroupItem>
                <h2>Payment Method</h2>
                <p><strong>Method:</strong> {order.paymentMethod}</p>
                {order.isPaid && <Message variant="success">Paid on {order.updatedAt}</Message>}
                {!order.isPaid && <Message variant="danger">Not Paid</Message>}
              </ListGroupItem>

              <ListGroupItem>
                <h2>Order Items</h2>
                {order.orderItems.map((item) => (
                  <ListGroupItem>
                  <Row>
                    <Col md={2}>
                      <Image src={item.image} rounded style={{width: '100%', height: '100px'}}></Image>
                    </Col>

                    <Col md={4}>
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </Col>

                    <Col md={4}>
                      {item.qty} x ${item.price.toFixed(2)} = ${(item.qty * item.price).toFixed(2)} 
                    </Col>
                  </Row>
                  </ListGroupItem>
                ))}
              </ListGroupItem>
            </ListGroup>
          </Col>

          <Col md={4}>
            <Card>  
                <ListGroup variant='flush'>
                  <ListGroupItem>
                    <h2>Order Summary</h2>
                  </ListGroupItem>

                  <ListGroupItem>
                    <Row>
                      <Col>Items</Col>
                      <Col>${order.itemsPrice}</Col>
                    </Row>
                  </ListGroupItem>

                  <ListGroupItem>
                    <Row>
                      <Col>Shipping</Col>
                      <Col>${order.shippingPrice}</Col>
                    </Row>
                  </ListGroupItem>

                  <ListGroupItem>
                    <Row>
                      <Col>Tax</Col>
                      <Col>${order.taxPrice}</Col>
                    </Row>
                  </ListGroupItem>

                  <ListGroupItem>
                    <Row>
                      <Col>Total</Col>
                      <Col>${order.totalPrice}</Col>
                    </Row>
                  </ListGroupItem>
                  {/*PAY ORDER*/}
                  {/*MARK AS DELIVERED*/}
                </ListGroup>
            </Card>
          </Col>
        </Row>
      </>
    )
  )
}

export default OrderScreen