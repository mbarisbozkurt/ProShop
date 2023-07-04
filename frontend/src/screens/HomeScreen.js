import React from 'react'
import {Row, Col} from "react-bootstrap"
// import products from '../products'
import { useEffect, useState } from 'react'
import axios from 'axios';
import Product from '../components/Product'


const HomeScreen = () => {
  const [products, setProducts] = useState([]);

  /*get the products from backend i.e server.js: app.get("/api/products", (req, res) => {
  res.json(products); })*/

  useEffect(() => {
   const fetchProducts = async () => {
      const {data} = await axios.get("/api/products"); 
      setProducts(data);
   }
   fetchProducts();
  }, []) //[] means: only one time

  return (
   <>
      <h1>Latest Products</h1>
      <Row>
         {products.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
               <Product product={product}/>
            </Col>
         ))} 
      </Row>         
   </>
  )
}

export default HomeScreen