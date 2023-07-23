import React from 'react'
import {Link, useParams} from "react-router-dom";
import {Row, Col, ListGroup, Image, Button, Card, ListGroupItem} from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useGetOrderDetailsQuery, usePayOrderMutation, useGetPayPalClientIdQuery } from "../slices/ordersApiSlice";
import {PayPalButtons, usePayPalScriptReducer} from "@paypal/react-paypal-js"
import {toast} from "react-toastify";
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const OrderScreen = () => {

  //get the orderId from the url
  const {id: orderId} = useParams();

  //get the data from the backend by using the orderId
  const{data: order, refetch, isLoading, error} = useGetOrderDetailsQuery(orderId);
  //console.log(order)

  const [payOrder, {isLoading: loadingPay}] = usePayOrderMutation();
  const {userInfo} = useSelector((state) => state.auth);

  const [{isPending}, paypalDispatch] = usePayPalScriptReducer();
  const {data: paypal, isLoading: loadingPayPal, error: errorPayPal} = useGetPayPalClientIdQuery();

  //CHOOSE "PAY WITH DEBIT OR CREDIT CARD or CREATE AN ACCOUNT" option, enter the fields, click "continue as guests"
  //THEN, CHECK COMPASS: isPaid should be true and paymentResult should be valid
  //FOR CREDIT CARD PAYMENTS: CHOOSE THE USA AS COUNTRY SINCE TURKEY IS NOT VALID FOR PAYPAL
  useEffect(() => {
    if(!errorPayPal && !loadingPayPal && paypal.clientId){
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "clientId": paypal.clientId,
            currency: "USD",
          }
        });
        paypalDispatch({type: "setLoadingStatus", value: "pending"});
      }
      if(order && !order.isPaid){
        if(!window.paypal){
          loadPayPalScript();
        }
      } 
    }
  }, [order, paypal, paypalDispatch, loadingPayPal, errorPayPal]);

  //if does not work, only keep the onApproveTest which does not require paypal
  function onApprove(data, actions) {
    //trigger paypal
    return actions.order.capture().then(async function(details){
      try {
        await payOrder({orderId, details});
        refetch(); //UI da direkt "paid" yazması için
        toast.success("Payment Successful!");
      } catch (err) {
        toast.error(err?.data?.message || err.message);
      }
    });
  }

  function onError(err) {
    toast.error(err.message);
  }

  function createOrder(data, actions) {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: order.totalPrice,
          },
        },
      ],
    }).then((orderId) => {
      return orderId;
    })
  }

  //check details part and the payment result in mongo
  async function onApproveTest(){
    await payOrder({orderId, details: {payer: {}}});
    refetch(); //order infosunu güncellemek için, databasede isPaid artık true olduğundan browserda direkt "paid" yazması için
    toast.success("Payment Successful!");
  }

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
                  
                  {!order.isPaid && (
                    <ListGroupItem>
                      {loadingPay && <Loader/>}
                      {isPending && <Loader/>}
                        <div>
                          <Button onClick={onApproveTest} style={{marginBottom: "20px"}}>Complete Order </Button>
                          <div>
                            <PayPalButtons
                              createOrder={createOrder}
                              onApprove={onApprove}
                              onError={onError}
                            ></PayPalButtons>
                            {/* <PayPalButtons onClick={onApproveTest} /> */}
                          </div>
                        </div>
                    </ListGroupItem>
                  )}

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