import React from 'react'
import {Row, Col} from "react-bootstrap"
// import products from '../products'
import Product from '../components/Product'
import { useGetProductsQuery } from '../slices/productsApiSlice'

const HomeScreen = () => {
  
  const{data: products, isLoading, error} = useGetProductsQuery(); //make a query for http://localhost:5000/api/products and get the data
  
  return (
   <>
      {isLoading ? (<h2>Loading...</h2>) : error ? (<div>{error?.data?.HomeScreen.message || error.error}</div>) : (
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

export default HomeScreen