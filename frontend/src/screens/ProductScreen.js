import { useState } from "react";
import { useParams, useNavigate} from "react-router-dom";
import React from 'react' 
// import products from "../products";
// import { useEffect, useState } from "react";
// import axios from "axios";
import { Link } from "react-router-dom";
import {Row, Col, Image, ListGroup, Card, Button, ListGroupItem, Form} from "react-bootstrap"
import Rating from "../components/Rating";
import { useGetProductDetailsQuery } from "../slices/productsApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import {addToCart} from "../slices/cartSlice"
import { useDispatch } from "react-redux";

const ProductScreen = () => {
  // //get the product from the backend(server.js), particularly: app.get("/api/products/:id")
  // const [product, setProduct] = useState({});

  // useEffect(() => {
  //   const fetchProduct = async () => {
  //     const {data} = await axios.get(`/api/products/${productId}`)
  //     setProduct(data);
  //   }
  //   fetchProduct();
  // },[productId]) //when productId changes, run this (after the column it specifies dependency)

  // get the id from url when the image clicked in Product.js
  const {id: productId} = useParams(); //productId: id in the url
  const [qty, setQty] = useState(1);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addToCartHandler = () => {
    dispatch(addToCart({...product, qty})); //send the item but only change the quantity (qty)
    navigate("/cart");
  }
 
  const{data: product, isLoading, error} = useGetProductDetailsQuery(productId); 

  return (
    <>
      <Link to="/" className="btn btn-light" style={{ marginBottom: "15px" }}>Go Back</Link>
      {isLoading ? <Loader/> : error ? <Message variant="danger">{error?.data?.message || error.error}</Message> : (
        <>
          <Row>
            <Col md={5}>
              <Image src={product.image} alt={product.name} fluid/>
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