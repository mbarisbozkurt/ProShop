import React, { useState } from 'react'
import {Row, Col, Button, Dropdown} from "react-bootstrap"
// import products from '../products'
import Product from '../components/Product'
import { useGetProductsQuery } from '../slices/productsApiSlice'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { useParams } from 'react-router-dom'
import Paginate from '../components/Paginate'
import { LinkContainer } from 'react-router-bootstrap'
import ProductCarousel from "../components/ProductCarousel"
import Meta from '../components/Meta'

const HomeScreen = () => {
  const [sortOrder, setSortOrder] = useState(""); //'ascending', 'descending'
  const {keyword, pageNumber} = useParams(); //keyword: get whatever is written in the SearchBox form url, pageNumber: comes from the url 
  const {data, isLoading, error} = useGetProductsQuery({keyword, pageNumber, sortOrder});
  
  return (
   <> 
      {isLoading ? <Loader/> : error ? <Message variant="danger">{error?.data?.message || error.error}</Message> : (
         <>
            {keyword &&
               <LinkContainer to={"/"}>
                  <Button className='btn btn-light'>Go Back</Button>
               </LinkContainer>
            }
            
            {!keyword && <ProductCarousel/>}
            
            <Meta/>
            
            <Row>
               <Col>
                  <h1 className='my-3'>Latest Products</h1> 
               </Col>

               {!keyword &&
                  <Col md={9}>
                     <Dropdown className='my-3'>
                        <Dropdown.Toggle variant="primary" id="dropdown">
                           Sort Products by Price
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                           <Dropdown.Item onClick={() => setSortOrder('ascending')}> In Ascending Order </Dropdown.Item>
                           <Dropdown.Item onClick={() => setSortOrder('descending')}> In Descending Order </Dropdown.Item>
                        </Dropdown.Menu>
                     </Dropdown>
                  </Col>
               }        
            </Row>
            
            <Row>
               {data.products && data.products.map((product) => (
                  <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                     <Product product={product}/>
                  </Col>
               ))} 
            </Row>
         
            <Row className="my-4" style={{ display: 'flex', justifyContent: 'center' }}>
               <Col xs={12} md={1}>
                  <Paginate pages={data.pages} page={data.page} keyword={keyword ? keyword : ""}/>
               </Col>
            </Row>
         </>
      )}
   </> 
  )
}

//if proxy error exists, run the server again

export default HomeScreen;