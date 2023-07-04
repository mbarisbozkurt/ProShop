import { useParams } from "react-router-dom";
import React from 'react' 
// import products from "../products";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {Row, Col, Image, ListGroup, Card, Button, ListGroupItem} from "react-bootstrap"
import Rating from "../components/Rating";

const ProductScreen = () => {
  //get the product from the backend(server.js), particularly: app.get("/api/products/:id")
  const [product, setProduct] = useState({});

  //get the id from url when the image clicked in Product.js
  const {id: productId} = useParams(); //productId: id in the url

  useEffect(() => {
    const fetchProduct = async () => {
      const {data} = await axios.get(`/api/products/${productId}`)
      setProduct(data);
    }
    fetchProduct();
  },[productId]) //when productId changes, run this (after the column it specifies dependency)

  return (
    <div>
      <Link to="/" className="btn btn-light" style={{ marginBottom: "15px" }}>Go Back</Link>
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

              <ListGroupItem>
                <Button className="btn-block" type="button" disabled={product.countInStock === 0}>
                  Add to Cart
                </Button> 
              </ListGroupItem>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default ProductScreen;