import React from 'react'
import {Row, Col, Button} from "react-bootstrap"
// import products from '../products'
import Product from '../components/Product'
import { useGetProductsQuery } from '../slices/productsApiSlice'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { useParams } from 'react-router-dom'
import Paginate from '../components/Paginate'
import { LinkContainer } from 'react-router-bootstrap'

const HomeScreen = () => {

  const {keyword, pageNumber} = useParams(); //get whatever is written in the SearchBox form
  //console.log(keyword);
  //console.log(pageNumber);

  const {data, isLoading, error} = useGetProductsQuery({keyword, pageNumber}); //make a query for http://localhost:5000/api/products and get the data by using keyword
  //console.log(data.products);
  
  return (
   <> 
      {isLoading ? <Loader/> : error ? <Message variant="danger">{error?.data?.message || error.error}</Message> : (
         <>
            {data.products.length !== 0 && //if there is a product that user searched for 
               <>
                  <LinkContainer to={"/"}>
                     <Button className='btn btn-light'>Go Back</Button>
                  </LinkContainer>
                  <h1 className='my-3'>Latest Products</h1>
                  <Row>
                     {data.products.map((product) => (
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
            }

            {data.products.length === 0 && //if there is no product that user searched for 
               <>
                  <h1 className='my-3'>Product Not Found</h1>
                  <LinkContainer to={"/"}>
                     <Button className='btn btn-light'>Go Back</Button>
                  </LinkContainer>
               </>
            }

         </>)}    
   </>
  )
}

//if proxy error exists, run the server again

export default HomeScreen;