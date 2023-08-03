import { useState } from "react";
import { useParams, useNavigate} from "react-router-dom";
import React from 'react' 
// import products from "../products";
// import { useEffect, useState } from "react";
// import axios from "axios";
import { Link } from "react-router-dom";
import {Row, Col, Image, ListGroup, Card,  Button, ListGroupItem, Form, FormGroup, FormLabel, FormControl} from "react-bootstrap"
import Rating from "../components/Rating";
import { useGetProductDetailsQuery, useCreateReviewMutation } from "../slices/productsApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import {addToCart} from "../slices/cartSlice"
import { useDispatch, useSelector } from "react-redux";
import {toast} from "react-toastify";
import CardHeader from "react-bootstrap/esm/CardHeader";

const ProductScreen = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {id: productId} = useParams(); //productId: id in the url
  const [qty, setQty] = useState(1);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addToCartHandler = () => {
    dispatch(addToCart({...product, qty})); //send the item but only change the quantity (qty)
    navigate("/cart");
  }
 
  const{data: product, isLoading, error, refetch} = useGetProductDetailsQuery(productId); 
  
  const [createReview, {isLoading: createReviewLoading}] = useCreateReviewMutation();
  const userInfo = useSelector((state)=> state.auth.userInfo);

  const submitHandler = async(event) => {
    event.preventDefault();
    //console.log(rating); console.log(comment);
    try {
      const reviewInfo = {productId, rating, comment}; 
      await createReview(reviewInfo).unwrap();
      refetch();
      toast.success("Review submitted");
      setRating(0);
      setComment("");
    } catch (error) {
      toast.error(error?.data?.message || error?.error);
    }
  }

  return (
    <>
      <Link to="/" className="btn btn-light" style={{ marginBottom: "15px" }}>Go Back</Link>
      {isLoading ? <Loader/> : error ? <Message variant="danger">{error?.data?.message || error.error}</Message> : (
        <>
          <Row>
            <Col md={5}>
              <Image src={product.image} alt={product.name} fluid/>
              
              <Row className="review">
                <h2>Reviews</h2>
                {product.numReviews === 0 && <Message variant={"danger"}>No Reviews</Message>}
                  {product && product.reviews.map((review) => (
                      <Col md={6}>
                        <Card className="my-2">
                          <CardHeader className="text-center"><h4>{review.name}</h4></CardHeader>
                          <Card.Body className="text-center">
                            <Rating rating={Number(review.rating)} />
                            <h6>{review.createdAt.substring(0,10)}</h6>
                            <h6>{review.comment}</h6>
                          </Card.Body>
                        </Card>
                      </Col>
                  ))}

              <Row className="my-4">
                <h2>Write a Customer Review</h2>
                {createReviewLoading && <Loader/>}

                {userInfo && 
                  <Form onSubmit={submitHandler}>
              
                  <FormGroup controlId="rating" className="my-1">
                    <FormLabel>Rating</FormLabel>
                    <Form.Control as="select" value={rating} style={{backgroundColor: "#61677A", color: "#FFF"}} onChange={(e) => setRating(Number(e.target.value))}>
                      <option value="">Choose...</option>
                      <option value="1">1 - Poor</option>
                      <option value="2">2 - Fair</option>
                      <option value="3">3 - Good</option>
                      <option value="4">4 - Very Good</option>
                      <option value="5">5 - Excellent </option>
                    </Form.Control>
                  </FormGroup>
                  
                  <FormGroup controlId="comment" className="my-3">
                      <FormLabel>Comment</FormLabel>
                      <FormControl 
                        as="textarea" 
                        row="3"
                        value={comment} 
                        onChange={(e) => setComment(e.target.value)}
                      /> 
                  </FormGroup>

                  <Button type="submit" disabled={createReviewLoading}>Submit</Button>
                </Form>
                }

                {!userInfo && 
                  <Message variant="danger">
                    Please <Link to="/login">Sign In</Link> To Write A Review
                  </Message>
                }     
              </Row>
                
              </Row>

            </Col>

            <Col md={4}>
              <ListGroup variant="flush">
                <ListGroupItem>
                  <h3>{product.name}</h3>
                </ListGroupItem>

                <ListGroupItem>
                  <Rating rating={product.rating} review={`${product.numReviews} reviews`}/>
                </ListGroupItem>

                <ListGroupItem>
                  Price: ${product.price}
                </ListGroupItem>

                <ListGroupItem>
                  {product.description}
                </ListGroupItem>
              </ListGroup>
            </Col>

            <Col md={3}>
              <Card>
                <ListGroup>
                  <ListGroupItem>
                    <Row>
                      <Col>
                        Price:
                      </Col>
                      <Col>
                        <strong>${product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroupItem>

                  <ListGroupItem>
                    <Row>
                      <Col>
                        Status:
                      </Col>
                      <Col>
                        <strong>{product.countInStock > 0 ? "In Stock" : "Out of Stock"}</strong>
                      </Col>
                    </Row>
                  </ListGroupItem>

                  {product.countInStock > 0 && (
                    <ListGroupItem>
                      <Row>
                        <Col>Quantity:</Col>
                        <Col>
                          <Form.Control
                            as="select"
                            value = {qty}
                            onChange = {(e) => setQty(Number(e.target.value))}>
                            {[...Array(product.countInStock).keys()].map((x) => ( //User'ın ekleyebileceği ürün miktarını gösterebilmek için
                              <option key={x+1} value={x+1}>
                                {x+1}
                              </option>
                            ))}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroupItem>
                  )}
                    
                  <ListGroupItem>
                    <Button className="btn-block" type="button" disabled={product.countInStock === 0} onClick={addToCartHandler}>
                      Add to Cart
                    </Button> 
                  </ListGroupItem>
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>)}
    </>
  )
}

export default ProductScreen;