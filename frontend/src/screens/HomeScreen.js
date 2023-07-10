import React from 'react'
import {Row, Col} from "react-bootstrap"
// import products from '../products'
import Product from '../components/Product'
import { useGetProductsQuery } from '../slices/productsApiSlice'
import Loader from '../components/Loader'
import Message from '../components/Message'

const HomeScreen = () => {
  
  const{data: products, isLoading, error} = useGetProductsQuery(); //make a query for http://localhost:5000/api/products and get the data
  
  return (
   <>
      {isLoading ? <Loader/> : error ? <Message variant="danger">{error?.data?.message || error.error}</Message> : (
         <>
            <h1>Latest Products</h1>
            <Row>
               {products.map((product) => (
                  <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                     <Product product={product}/>
                  </Col>
               ))} 
            </Row>     
         </>)}    
   </>
  )
}

//if projy error exists, run the server again

export default HomeScreen