import React from 'react'
import {Row, Col} from "react-bootstrap"
// import products from '../products'
import Product from '../components/Product'
import { useGetProductsQuery } from '../slices/productsApiSlice'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { useParams } from 'react-router-dom'
import Paginate from '../components/Paginate'

const HomeScreen = () => {

  const {pageNumber} = useParams(); //e.g if: http://localhost:3000/page/2 then: pageNumber = 2, look at index.js
  const {data, isLoading, error} = useGetProductsQuery({pageNumber}); //make a query for http://localhost:5000/api/products and get the data
  //console.log(data);
  
  return (
   <>
      {isLoading ? <Loader/> : error ? <Message variant="danger">{error?.data?.message || error.error}</Message> : (
         <>
            <h1>Latest Products</h1>
            <Row>
               {data.products.map((product) => (
                  <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                     <Product product={product}/>
                  </Col>
               ))} 
            </Row>
            
            <Row className="my-4" style={{ display: 'flex', justifyContent: 'center' }}>
               <Col xs={12} md={1}>
                  <Paginate pages={data.pages} page={data.page}/>
               </Col>
            </Row>
         </>)}    
   </>
  )
}

//if proxy error exists, run the server again

export default HomeScreen;